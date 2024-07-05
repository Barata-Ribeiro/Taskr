import Navigation from "@/components/dashboard/navigation"

import { type ReactNode } from "react"

interface DashboardLayoutProps {
    children: ReactNode
}

export default function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
    return (
        <div className="min-h-full">
            <Navigation />
            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    )
}
