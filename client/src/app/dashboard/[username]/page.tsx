import AccountInformationSkeleton from "@/components/ui/skeletons/AccountInformationSkeleton"
import ProjectMembershipsSkeleton from "@/components/ui/skeletons/ProjectMembershipsSkeleton"
import StatsCardsSkeleton from "@/components/ui/skeletons/StatsCardsSkeleton"
import WelcomeBannerSkeleton from "@/components/ui/skeletons/WelcomeBannerSkeleton"
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
            {/* Welcoming Section */}
            <Suspense fallback={<WelcomeBannerSkeleton />}>
                <WelcomeBanner />
            </Suspense>

            {/* Stats Cards */}
            <Suspense fallback={<StatsCardsSkeleton />}>
                <StatsCards />
            </Suspense>

            {/* Project Memberships */}
            <Suspense fallback={<ProjectMembershipsSkeleton />}>
                <ProjectMemberships />
            </Suspense>

            {/* Account Info */}
            <Suspense fallback={<AccountInformationSkeleton />}>
                <AccountInformation />
            </Suspense>
        </>
    )
}
