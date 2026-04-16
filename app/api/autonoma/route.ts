import { createHandler } from "@autonoma-ai/server-web";
import { drizzleExecutor } from "@autonoma-ai/sdk-drizzle";
import { pool } from "@/db";

// eslint-disable-next-lin @typescript-eslint/no-explicit-any
const autonomaDb: any = {
  async execute({ sql, params }: { sql: string; params: unknown[] }) {
    return pool.query(sql, params).then((r) => ({ rows: r.rows }));
  },
  async transaction<T>(fn: (tx: typeof autonomaDb) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const txDb = {
        async execute({ sql, params }: { sql: string; params: unknown[] }) {
          return client.query(sql, params).then((r) => ({ rows: r.rows }));
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transaction: (innerFn: any) => innerFn(txDb),
      };
      const result = await fn(txDb);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

export const POST = createHandler({
  executor: drizzleExecutor(autonomaDb),
  scopeField: "userId",
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET!,
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET!,
  auth: async (user) => {
    if (!user?.id) return {};
    return { headers: { Cookie: `user_id=${user.id as string}` } };
  },
});
