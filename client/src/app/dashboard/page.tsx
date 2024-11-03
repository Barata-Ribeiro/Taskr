import getUserDashboard from "@/actions/user/get-user-dashboard"
import { auth } from "@/auth"
import Avatar from "@/components/helpers/avatar"
import BadgePillWithDot from "@/components/helpers/badge-pill-with-dot"
import SimpleProjectCard from "@/components/simple-project-card"
import { UserDashboard } from "@/interfaces/user"
import { Metadata } from "next"
import { FaBell } from "react-icons/fa6"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function HomePage() {
    const session = await auth()

    const state = await getUserDashboard()
    if (!state) return null

    const data = state.response?.data as UserDashboard

    const { context, organizationsWhereUserIsMember, projectsWhereUserIsMember } = data

    return (
        <div className="container mx-auto p-4">
            {/* Header Section */}
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar src={context.avatarUrl} />

                    <div className="ml-4">
                        <h1 className="font-heading text-2xl">{context.displayName}</h1>
                        <p className="text-gray-600">{context.email}</p>
                        <BadgePillWithDot role={context.role} />
                    </div>
                </div>

                {/* Notifications Icon Placeholder */}
                <div>
                    <button className="relative">
                        <FaBell aria-hidden="true" className="h-6 w-6 text-gray-700" />
                        {context.totalUnreadNotifications > 0 && (
                            <span className="absolute right-0 top-0 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
                                {context.totalUnreadNotifications}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Sidebar - Organizations */}
                <aside className="rounded-lg bg-white p-4 shadow-derek md:col-span-1">
                    <h2 className="mb-4 font-heading text-xl">Organizations</h2>
                    <ul>
                        {organizationsWhereUserIsMember.map(org => (
                            <li key={org.id} className="mb-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{org.name}</span>
                                    {org.isOwner && <span className="text-sm text-green-500">Owner</span>}
                                    {org.isAdmin && <span className="text-sm text-blue-500">Admin</span>}
                                </div>
                            </li>
                        ))}
                        {organizationsWhereUserIsMember.length === 0 && (
                            <p className="text-gray-500">No organizations found.</p>
                        )}
                    </ul>
                </aside>

                {/* Projects and Tasks */}
                <section className="md:col-span-2">
                    {/* Projects Section */}
                    <article className="mb-6">
                        <h2 className="mb-4 font-heading text-xl">Projects</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {projectsWhereUserIsMember.map(project => (
                                <SimpleProjectCard
                                    key={project.id}
                                    name={project.name}
                                    isManager={project.isManager}
                                    totalTasks={project.totalTasks}
                                    latestTasks={project.latestTasks}
                                />
                            ))}
                            {projectsWhereUserIsMember.length === 0 && (
                                <p className="text-gray-500">No projects found.</p>
                            )}
                        </div>
                    </article>

                    {/* Additional Sections can be added below */}
                </section>
            </div>
        </div>
    )
}
