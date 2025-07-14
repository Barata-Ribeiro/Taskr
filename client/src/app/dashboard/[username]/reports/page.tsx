import { QueryParams } from "@/@types/application"
import getAllMyProjectsPaginated from "@/actions/project/get-all-my-projects-paginated"
import GlobalStats from "@/components/stats/GlobalStats"
import ProjectStatsList from "@/components/stats/ProjectStatsList"
import DividerIconOnly from "@/components/ui/DividerIconOnly"
import GlobalStatsSkeleton from "@/components/ui/skeletons/GlobalStatsSkeleton"
import { auth } from "auth"
import { ChartPieIcon } from "lucide-react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Fragment, Suspense } from "react"

interface StatsPageProps {
    params: Promise<{ username: string }>
}

export const metadata: Metadata = {
    title: "Reports",
    description:
        "View all reports and statistics for the application, including global, project-specific, and user-specific stats.",
}

export default async function StatsPage({ params }: Readonly<StatsPageProps>) {
    const [{ username }, session] = await Promise.all([params, auth()])
    if (!session) redirect("/auth/login")
    if (session.user.username !== username) redirect(`/dashboard/${session.user.username}/reports`)

    const queryParams: QueryParams = { page: 0, perPage: 10, direction: "DESC", orderBy: "createdAt" }
    const myProjectsPromise = getAllMyProjectsPaginated(queryParams)

    const baseUrl = `/dashboard/${username}/projects`

    return (
        <Fragment>
            <Suspense fallback={<GlobalStatsSkeleton />}>
                <GlobalStats />
            </Suspense>

            <DividerIconOnly icon={ChartPieIcon} />

            {/*// TODO: Add project-specific loading skeleton*/}
            <Suspense fallback={<div>Loading...</div>}>
                <ProjectStatsList projectsPromise={myProjectsPromise} baseUrl={baseUrl} />{" "}
            </Suspense>

            <DividerIconOnly icon={ChartPieIcon} />

            <Suspense fallback={<div>Loading...</div>}>{/*TODO: Add user-specific stats component here*/}</Suspense>
        </Fragment>
    )
}
