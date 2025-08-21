import adminGetUserByUsername from "@/actions/admin/admin-get-user-by-username"
import { auth } from "auth"
import { MoveLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Fragment } from "react"

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

    const baseUrl = `/dashboard/${session.user.username}`
    const baseAdminUrl = `${baseUrl}/admin/users`
    const backLinkLabel = "Back to User Management"

    return (
        <Fragment>
            <header className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
                <Link
                    href={baseAdminUrl}
                    aria-label={backLinkLabel}
                    title={backLinkLabel}
                    className="mb-4 inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <MoveLeftIcon aria-hidden size={16} /> {backLinkLabel}
                </Link>

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
        </Fragment>
    )
}
