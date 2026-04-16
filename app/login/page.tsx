import { redirect } from "next/navigation"
import { getUserId } from "@/lib/session"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const userId = await getUserId()
  if (userId) redirect("/")

  return <LoginForm />
}
