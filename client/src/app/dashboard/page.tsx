import getUserDashboard from "@/actions/user/get-user-dashboard"
import { auth } from "@/auth"
import { UserDashboard } from "@/interfaces/user"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function HomePage() {
    const session = await auth()

    const state = await getUserDashboard()
    if (!state) return null

    const data = state.response?.data as UserDashboard

    return (
        <section>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user.username}!</p>

            <p>{JSON.stringify(data)}</p>
        </section>
    )
}
