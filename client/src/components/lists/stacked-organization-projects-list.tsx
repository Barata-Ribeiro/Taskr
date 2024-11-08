import ProjectStatusBadge from "@/components/helpers/project-status-badge"
import { Paginated } from "@/interfaces/actions"
import { OrganizationProject } from "@/interfaces/project"
import parseDate from "@/utils/parse-date"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"

interface StackedOrganizationProjectsListProps {
    orgId: string
    data: Paginated<OrganizationProject>
}

export default function StackedOrganizationProjectsList({
    orgId,
    data,
}: Readonly<StackedOrganizationProjectsListProps>) {
    if (!data) return <p>No projects found</p>

    return (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-900/5">
            {data.content.map(pivot => {
                const projectKey = pivot.project.name + "_" + pivot.project.id
                const projectUrl = `/dashboard/organizations/${orgId}/projects/${pivot.project.id}`
                return (
                    <li
                        key={projectKey}
                        className="relative flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
                        aria-labelledby={`project-${projectKey}-title`}>
                        <div className="min-w-0">
                            <div className="flex items-start gap-x-3">
                                <h3
                                    id={`project-${projectKey}-title`}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    <Link href={projectUrl}>
                                        <span className="absolute inset-x-0 -top-px bottom-0" />
                                        {pivot.project.name}
                                    </Link>
                                </h3>
                                <ProjectStatusBadge status={pivot.project.status} type="text-only" />
                            </div>
                            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                <p className="whitespace-nowrap">
                                    Due on{" "}
                                    <time dateTime={pivot.project.deadline}>{parseDate(pivot.project.deadline)}</time>
                                </p>
                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                    <circle r={1} cx={1} cy={1} />
                                </svg>
                                <p className="truncate">
                                    {pivot.project.membersCount} member(s), {pivot.project.tasksCount} task(s)
                                </p>
                            </div>
                        </div>

                        <FaChevronRight aria-hidden="true" className="h-3 w-3 flex-none text-gray-400" />
                    </li>
                )
            })}
        </ul>
    )
}
