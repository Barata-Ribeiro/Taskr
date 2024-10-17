import getUserContext from "@/actions/user/get-user-context"
import Sidebar from "@/components/sidebar"
import { UserContext } from "@/interfaces/user"
import { auth } from "auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await auth()
    const contextState = await getUserContext()

    if (!session || contextState.error) return redirect("/auth/login")

    const context = contextState.response?.data as UserContext

    return <Sidebar data={context}>{children}</Sidebar>
}
