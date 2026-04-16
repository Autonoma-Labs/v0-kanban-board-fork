"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { clearSession, setSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const raw = formData.get("username")
  if (typeof raw !== "string") return

  const username = raw.trim().toLowerCase()
  if (!username) return

  // Upsert: insert if not exists, get back the user
  await db.insert(users).values({ username }).onConflictDoNothing()
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  })
  if (!user) throw new Error("Failed to create or find user")

  await setSession(user.id)
  redirect("/")
}

export async function logout() {
  await clearSession()
  redirect("/login")
}
