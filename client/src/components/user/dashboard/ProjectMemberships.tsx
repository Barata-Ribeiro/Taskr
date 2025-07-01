import { ProjectRole } from "@/@types/project"
import getUserAccount from "@/actions/user/get-user-account"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import ProjectRoleBadge from "@/components/shared/project/ProjectRoleBadge"
import ProjectStatusBadge from "@/components/shared/project/ProjectStatusBadge"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import { FolderPlusIcon, PlusIcon } from "lucide-react"

export default async function ProjectMemberships() {
    const accountResponse = await getUserAccount()

    if (!accountResponse.ok || !accountResponse.response?.data) {
        return <DashboardErrorMessage message="Failed to load project memberships. Please try again later." />
    }

    const account = accountResponse.response.data

    if (account.memberships.length <= 0) {
        return (
            <section className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <FolderPlusIcon aria-hidden className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium">No projects</h3>
                <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Get started by creating a new project.
                </p>
                <DefaultLinkButton href={`/dashboard/${account.username}/projects/create`} width="fit">
                    <PlusIcon aria-hidden size={18} />
                    New Project
                </DefaultLinkButton>
            </section>
        )
    }

    return (
        <section className="space-y-4 overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:px-6 dark:bg-gray-800">
            <header className="grid">
                <h2 className="text-lg font-semibold">Projects Memberships</h2>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
                    You are a member of {account.memberships.length} project{account.memberships.length > 1 ? "s" : ""}.
                </p>
            </header>

            {account.memberships.map(membership => (
                <div
                    key={membership.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <ProjectStatusBadge status={membership.project.status} type="icon" />
                            <div>
                                <h4 className="font-medium">Projeto Incrivel</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Joined {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ProjectStatusBadge status={membership.project.status} type="text" />
                        <ProjectRoleBadge role={ProjectRole.OWNER} />
                    </div>
                </div>
            ))}
        </section>
    )
}
