import Sidebar from "@/components/sidebar"
import { auth } from "auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await auth()
    if (!session) return redirect("/auth/login")

    console.log("Current session: ", session)

    return <Sidebar session={session}>{children}</Sidebar>
}
