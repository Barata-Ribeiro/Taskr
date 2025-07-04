import Sidebar from "@/components/Sidebar"
import WebsocketProvider from "@/components/WebsocketProvider"
import { auth } from "auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

interface DashboardLayoutProps {
    children: ReactNode
}

export default async function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
    const session = await auth()
    if (!session) redirect("/auth/login")

    return (
        <WebsocketProvider>
            <Sidebar />

            <main className="py-10 lg:pl-72">
                <div className="space-y-6 px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
        </WebsocketProvider>
    )
}
