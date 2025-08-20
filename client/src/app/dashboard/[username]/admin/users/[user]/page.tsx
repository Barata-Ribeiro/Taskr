import adminGetUserByUsername from "@/actions/admin/admin-get-user-by-username"
import { auth } from "auth"
import { notFound, redirect } from "next/navigation"

interface UserPageProps {
    params: Promise<{ username: string; user: string }>
}

export default async function UserPage({ params }: Readonly<UserPageProps>) {
    const [{ username, user }, session] = await Promise.all([params, auth()])

    if (!username || !user) return notFound()
    if (!session) return redirect("/auth/login")
    if (session.user.username !== username || session.user.username === user) {
        return redirect(`/dashboard/${session.user.username}/settings`)
    }
    if (session.user.role !== "ADMIN") return redirect(`/dashboard/${session.user.username}`)

    const userResponse = await adminGetUserByUsername(user)
    if (!userResponse.ok || !userResponse.response?.data) return notFound()

    const account = userResponse.response.data

    return (
        <section>
            {/*TODO: Add go back link*/}
            <header>
                <h1 className="mb-4 text-2xl font-bold">User Management</h1>
                <p className="mb-6">
                    Manage user details for <strong>{account.username}</strong>.
                </p>
            </header>
            <p className="text-gray-500">
                This section is under development. Please check back later for user management features.
            </p>

            {/*TODO: Implement user management features*/}
            {JSON.stringify(account, null, 2)}
        </section>
    )
}
