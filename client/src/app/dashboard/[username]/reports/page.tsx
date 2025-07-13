import GlobalStats from "@/components/stats/GlobalStats"
import { auth } from "auth"
import { redirect } from "next/navigation"
import { Fragment, Suspense } from "react"

interface StatsPageProps {
    params: Promise<{ username: string }>
}

export default async function StatsPage({ params }: Readonly<StatsPageProps>) {
    const [{ username }, session] = await Promise.all([params, auth()])
    if (!session) redirect("/auth/login")
    if (session.user.username !== username) redirect(`/dashboard/${session.user.username}/reports`)

    return (
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
                <GlobalStats />
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>{/*TODO: Add project-specific stats component here*/}</Suspense>

            <Suspense fallback={<div>Loading...</div>}>{/*TODO: Add user-specific stats component here*/}</Suspense>
        </Fragment>
    )
}
