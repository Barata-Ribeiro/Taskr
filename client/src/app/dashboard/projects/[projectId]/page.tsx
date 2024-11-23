import getProjectByOrgIdAndProjectId from "@/actions/projects/get-project-by-org-id-and-project-id"
import ProjectPage from "@/app/dashboard/organizations/[id]/projects/[projectId]/page"
import { ProjectInfoResponse } from "@/interfaces/project"
import parseDate from "@/utils/parse-date"
import { notFound } from "next/navigation"

interface DashboardProjectPageProps {
    params: {
        projectId: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: DashboardProjectPageProps) {
    if (!params.projectId || !searchParams?.orgId) return notFound()

    const projectState = await getProjectByOrgIdAndProjectId({
        projectId: +params.projectId,
        orgId: +searchParams?.orgId,
    })

    const projectData = projectState.response?.data as ProjectInfoResponse
    return {
        title: `Project ${projectData.project.name}`,
        description: `You are viewing project '${projectData.project.name}'. Its description is '${projectData.project.description}'; Currently, it has ${projectData.project.tasksCount} tasks. The project was created on ${parseDate(
            projectData.project.createdAt,
        )} and last updated on ${parseDate(
            projectData.project.updatedAt,
        )}. The project deadline is ${parseDate(projectData.project.deadline)}.`,
    }
}

export default async function DashboardProjectPage({ params, searchParams }: Readonly<DashboardProjectPageProps>) {
    if (!params.projectId || !searchParams?.orgId) return notFound()

    return <ProjectPage params={{ id: searchParams.orgId as string, projectId: params.projectId }} />
}
