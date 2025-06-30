import AccountInformation from "@/components/user/dashboard/AccountInformation"
import ProjectMemberships from "@/components/user/dashboard/ProjectMemberships"
import StatsCards from "@/components/user/dashboard/StatsCards"
import WelcomeBanner from "@/components/user/dashboard/WelcomeBanner"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface DashboardPageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Readonly<DashboardPageProps>) {
    const { username } = await params

    return {
        title: username,
        description: `User dashboard for ${username}. View your stats, projects, and account information.`,
    }
}

export default async function DashboardPage({ params }: Readonly<DashboardPageProps>) {
    const { username } = await params
    if (!username) notFound()

    return (
        <>
            {/* TODO: Create loading component */}
            {/* Welcoming Section */}
            <Suspense fallback={<div>Loading welcome message...</div>}>
                <WelcomeBanner />
            </Suspense>

            {/* TODO: Create loading component */}
            {/* Stats Cards */}
            <Suspense fallback={<div>Loading stats...</div>}>
                <StatsCards />
            </Suspense>

            {/* TODO: Create loading component */}
            {/* Project Memberships */}
            <Suspense fallback={<div>Loading project memberships...</div>}>
                <ProjectMemberships />
            </Suspense>

            {/* TODO: Create loading component */}
            {/* Account Info */}
            <Suspense fallback={<div>Loading account information...</div>}>
                <AccountInformation />
            </Suspense>
        </>
    )
}
