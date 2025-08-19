import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import Avatar from "@/components/user/Avatar"
import Badge from "@/components/user/Badge"
import VerifiedBadge from "@/components/user/VerifiedBadge"
import { auth } from "auth"

export default async function WelcomeBanner() {
    const session = await auth()

    if (!session) return <DashboardErrorMessage message="Failed to load user session. Please try again later." />

    return (
        <header className="grid grid-cols-[auto_1fr] items-center gap-x-4 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6 dark:bg-gray-800">
            <Avatar url={session.user.avatarUrl} name={session.user.username} size="medium" />
            <div className="flex flex-col">
                <h1 className="inline-flex items-center gap-x-2 text-2xl font-semibold">
                    Welcome back, {session.user.username} {session.user.isVerified && <VerifiedBadge size={20} />}!
                </h1>
                <small className="mb-2 text-sm text-gray-500 dark:text-gray-400">@{session.user.username}</small>
                <Badge userRole={session.user.role} />
            </div>
        </header>
    )
}
