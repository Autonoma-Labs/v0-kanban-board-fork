import { cookies } from "next/headers"

const COOKIE_NAME = "user_id"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
