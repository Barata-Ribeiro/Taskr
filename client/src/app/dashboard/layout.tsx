import getUserContext from "@/actions/user/get-user-context"
import Sidebar from "@/components/sidebar"
import { UserContext } from "@/interfaces/user"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    const [session, contextState] = await Promise.all([auth(), getUserContext()])

    if (!session) return redirect("/auth/login")
    if (contextState.error) return notFound()

    const context = contextState.response?.data as UserContext

    return <Sidebar data={context}>{children}</Sidebar>
}
