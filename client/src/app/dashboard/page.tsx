import getUserDashboard from "@/actions/user/get-user-dashboard"
import { auth } from "@/auth"
import Badge from "@/components/badges/badge"
import BadgePillWithDot from "@/components/badges/badge-pill-with-dot"
import StateError from "@/components/feedback/state-error"
import Avatar from "@/components/helpers/avatar"
import NotificationIcon from "@/components/notification-icon"
import SimpleProjectCard from "@/components/simple-project-card"
import { ProblemDetails } from "@/interfaces/actions"
import { UserDashboard } from "@/interfaces/user"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function HomePage() {
    const sessionPromise = auth()
    const dashboardStatePromise = getUserDashboard()

    const [session, dashboardState] = await Promise.all([sessionPromise, dashboardStatePromise])
    if (!session || !dashboardState) return redirect("/auth/login")
    if (dashboardState.error) return <StateError error={dashboardState.error as ProblemDetails} />

    const data = dashboardState.response?.data as UserDashboard

    const { context, organizationsWhereUserIsMember, projectsWhereUserIsMember } = data

    return (
        <div className="container mx-auto p-4">
            {/* Header Section */}
            <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="order-2 flex items-start gap-4 sm:order-1 sm:items-center">
                    <Avatar
                        name={data.context.fullName ?? data.context.displayName}
                        size={48}
                        src={data.context.avatarUrl}
                    />

                    <div>
                        <h1 className="font-heading text-2xl">{context.displayName}</h1>
                        <p className="text-gray-600">{context.email}</p>
                        <BadgePillWithDot role={context.role} />
                    </div>
                </div>

                <NotificationIcon context={context} />
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Sidebar - Organizations */}
                <aside className="rounded-lg bg-white p-4 shadow-derek md:col-span-1">
                    <h2 className="mb-4 text-2xl font-semibold leading-none tracking-tight">Organizations</h2>
                    {organizationsWhereUserIsMember.length > 0 ? (
                        <ul className="space-y-2">
                            {organizationsWhereUserIsMember.map(org => (
                                <li key={org.id} className="flex items-center justify-between">
                                    <span>{org.name}</span>
                                    <div className="space-x-2">
                                        {org.isOwner && <Badge variant="default">Owner</Badge>}
                                        {org.isAdmin && <Badge variant="secondary">Admin</Badge>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No organizations found.</p>
                    )}
                </aside>

                {/* Projects and Tasks */}
                <section className="md:col-span-2">
                    {/* Projects Section */}
                    <article className="rounded-lg bg-white p-4 shadow-derek md:col-span-1">
                        <h2 className="mb-4 text-2xl font-semibold leading-none tracking-tight">Projects</h2>
                        <div className="w-full space-y-1.5 divide-y divide-gray-200">
                            {projectsWhereUserIsMember.map(project => (
                                <SimpleProjectCard key={project.id} project={project} />
                            ))}
                            {projectsWhereUserIsMember.length === 0 && (
                                <p className="text-gray-500">You are not a member of any projects.</p>
                            )}
                        </div>
                    </article>

                    {/* Additional Sections can be added below */}
                </section>
            </div>
        </div>
    )
}
