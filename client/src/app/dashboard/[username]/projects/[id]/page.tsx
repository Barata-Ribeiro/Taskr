import getProjectActivities from "@/actions/project/get-project-activities"
import getProjectById from "@/actions/project/get-project-by-id"
import ProjectFeed from "@/components/project/ProjectFeed"
import ProjectInformation from "@/components/project/ProjectInformation"
import ProjectLatestTasks from "@/components/project/ProjectLatestTasks"
import ProjectMemberships from "@/components/project/ProjectMemberships"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import ProjectFeedSkeleton from "@/components/ui/skeletons/ProjectFeedSkeleton"
import ProjectInformationSkeleton from "@/components/ui/skeletons/ProjectInformationSkeleton"
import ProjectMembershipsSkeleton from "@/components/ui/skeletons/ProjectMembershipsSkeleton"
import { auth } from "auth"
import { MoveLeftIcon, SquarePenIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment, Suspense } from "react"

interface ProjectPageProps {
    params: Promise<{ username: string; id: string }>
}

export async function generateMetadata({ params }: Readonly<ProjectPageProps>) {
    const { username, id } = await params
    if (!username || !id) return notFound()

    const projectResponse = await getProjectById(parseInt(id))
    if (!projectResponse.ok || !projectResponse.response?.data) return notFound()

    const project = projectResponse.response.data
    const projectOwner = project.memberships.find(m => m.role === "OWNER")?.user.displayName

    return {
        title: project.title,
        description: `Details about the project "${project.title}" owned by ${projectOwner}.`,
        openGraph: {
            title: project.title,
            description: `Details about the project "${project.title}" owned by ${projectOwner}.`,
            url: `/dashboard/${username}/projects/${id}`,
        },
    }
}

export default async function ProjectPage({ params }: Readonly<ProjectPageProps>) {
    const [{ username, id }, session] = await Promise.all([params, auth()])

    if (!username || !id) return notFound()

    if (!session) return redirect("/auth/login")
    if (session.user.username !== username) return redirect(`/dashboard/${session.user.username}/projects/${id}`)

    const baseUrl = `/dashboard/${username}`

    const projectActivitiesPromise = getProjectActivities({
        projectId: parseInt(id),
        queryParams: {
            page: 0,
            perPage: 10,
            direction: "DESC",
            orderBy: "createdAt",
        },
    })

    return (
        <Fragment>
            <header className="flex items-center justify-between gap-4">
                <Link
                    href={`${baseUrl}/projects`}
                    aria-label="Back to Projects"
                    title="Back to Projects"
                    className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden size={16} /> Back to Projects
                </Link>

                <DefaultLinkButton href={`${baseUrl}/projects/${id}/edit`} width="fit">
                    <SquarePenIcon aria-hidden size={16} /> Edit Project
                </DefaultLinkButton>
            </header>

            <Suspense fallback={<ProjectInformationSkeleton />}>
                <ProjectInformation id={parseInt(id)} />
            </Suspense>

            <Suspense fallback="Loading...">
                <ProjectLatestTasks id={parseInt(id)} baseUrl={baseUrl} />
            </Suspense>

            <Suspense fallback={<ProjectMembershipsSkeleton />}>
                <ProjectMemberships id={parseInt(id)} baseUrl={baseUrl} />
            </Suspense>

            <Suspense fallback={<ProjectFeedSkeleton />}>
                <ProjectFeed activitiesPromise={projectActivitiesPromise} id={parseInt(id)} />
            </Suspense>
        </Fragment>
    )
}
