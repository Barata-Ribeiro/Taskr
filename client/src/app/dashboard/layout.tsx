import getUserContext from "@/actions/user/get-user-context"
import Sidebar from "@/components/sidebar"
import { UserContext } from "@/interfaces/user"
import { auth } from "auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    const sessionPromise = auth()
    const userContextPromise = getUserContext()

    const [session, context] = await Promise.all([sessionPromise, userContextPromise])

    if (!session || context.error) return redirect("/auth/login")

    return <Sidebar data={context.response?.data as UserContext}>{children}</Sidebar>
}
