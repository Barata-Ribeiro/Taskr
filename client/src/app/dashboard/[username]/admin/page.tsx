import LatestProjects from "@/components/admin/LatestProjects"
import LatestUsers from "@/components/admin/LatestUsers"
import LatestUsersSkeleton from "@/components/ui/skeletons/LatestUsersSkeleton"
import LatestProjectsSkeleton from "@/components/ui/skeletons/LatestProjectsSkeleton"
import { auth } from "auth"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Fragment, Suspense } from "react"

interface AdminPageProps {
    params: Promise<{ username: string }>
}

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Admin panel for managing users, projects and more.",
}

export default async function AdminPage({ params }: Readonly<AdminPageProps>) {
    const [{ username }, session] = await Promise.all([params, auth()])

    if (!username) return notFound()
    if (!session) redirect("/auth/login")
    if (session.user.username !== username) redirect(`/dashboard/${session.user.username}/settings`)
    if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.username}`)

    return (
        <Fragment>
            <Suspense fallback={<LatestUsersSkeleton />}>
                <LatestUsers session={session} />
            </Suspense>

            <Suspense fallback={<LatestProjectsSkeleton />}>
                <LatestProjects session={session} />
            </Suspense>
        </Fragment>
    )
}
