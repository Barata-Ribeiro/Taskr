"use client"

import { ProblemDetails } from "@/@types/application"
import { UserStats } from "@/@types/stats"
import { User } from "@/@types/user"
import adminSearchUsers from "@/actions/admin/admin-search-users"
import getUserStats from "@/actions/stats/get-user-stats"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import Spinner from "@/components/shared/Spinner"
import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import { UserRoundSearchIcon } from "lucide-react"
import { type FormEvent, useState, useTransition } from "react"
import UserStatsSkeleton from "./UserStatsSkeleton"

export default function UserStatsPanel() {
    const [term, setTerm] = useState("")
    const [results, setResults] = useState<Array<Pick<User, "id" | "username" | "createdAt">> | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [stats, setStats] = useState<UserStats | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    async function handleSearch(e?: FormEvent) {
        e?.preventDefault()
        if (!term || isPending) return

        startTransition(async () => {
            setError(null)
            setResults(null)
            setSelectedUserId(null)
            setStats(null)

            try {
                const res = await adminSearchUsers(term)
                if (!res.ok || !res.response?.data) {
                    const isProblem = (res.error as ProblemDetails)?.type !== undefined
                    const message = isProblem ? (res.error as ProblemDetails).detail : "Failed to search users"
                    setError(message)
                    return
                }

                setResults(res.response.data)
            } catch (e: unknown) {
                const isProblem = (e as ProblemDetails)?.type !== undefined
                const message = isProblem ? (e as ProblemDetails).detail : "An error occurred while searching users"
                setError(message)
            }
        })
    }

    function handleSelectUser(id: string) {
        if (isPending) return

        startTransition(async () => {
            setError(null)
            setSelectedUserId(id)
            setStats(null)

            try {
                const res = await getUserStats(id)
                if (!res.ok || !res.response?.data) {
                    const isProblem = (res.error as ProblemDetails)?.type !== undefined
                    const message = isProblem ? (res.error as ProblemDetails).detail : "Failed to fetch user stats"
                    setError(message)
                    return
                }

                setStats(res.response.data)
            } catch (e: unknown) {
                const isProblem = (e as ProblemDetails)?.type !== undefined
                const message = isProblem ? (e as ProblemDetails).detail : "An error occurred while fetching user stats"
                setError(message)
            }
        })
    }

    return (
        <section aria-labelledby="user-stats-heading" className="mt-6 w-full">
            <h2 id="user-stats-heading" className="text-2xl/7 font-bold">
                User Statistics
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
                Search for a user to view their individual statistics.
            </p>

            <form onSubmit={handleSearch} className="mt-4 inline-flex w-full items-center gap-x-2">
                <DefaultInput
                    type="search"
                    value={term}
                    onChange={e => setTerm((e.target as HTMLInputElement).value)}
                    placeholder="Search by username, email or name"
                    className="m-0 w-full flex-1 sm:w-2xs"
                    aria-label="Search users"
                />
                <DefaultButton
                    type="submit"
                    disabled={!term || isPending}
                    aria-label="Press to search"
                    width="fit"
                    buttonType="ghost"
                    isIconOnly>
                    {isPending ? <Spinner /> : <UserRoundSearchIcon aria-hidden size={18} />}
                </DefaultButton>
            </form>

            <div className="mt-4">
                {error && <DashboardErrorMessage message={error} />}

                {isPending && !results && <UserStatsSkeleton />}

                {results && results.length === 0 && <p>No users found.</p>}

                {results && results.length > 0 && (
                    <ul className="mt-2 space-y-2">
                        {results.map(r => (
                            <li
                                key={r.id}
                                className="flex items-center justify-between rounded-md border border-gray-200 p-2 dark:border-gray-700">
                                <div>
                                    <div className="font-medium">{r.username}</div>
                                    <div className="text-sm text-gray-500">
                                        Joined: {new Date(r.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-md">
                                        <DefaultButton
                                            onClick={() => handleSelectUser(r.id)}
                                            width="auto"
                                            buttonType="color">
                                            View Stats
                                        </DefaultButton>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {selectedUserId && isPending && (
                    <div className="mt-4">
                        <UserStatsSkeleton />
                    </div>
                )}

                {stats && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <div className="text-xs font-semibold text-gray-500">Projects Owned</div>
                            <div className="mt-1 text-2xl font-bold">{stats.totalProjectsOwned}</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <div className="text-xs font-semibold text-gray-500">Tasks Assigned</div>
                            <div className="mt-1 text-2xl font-bold">{stats.totalTasksAssigned}</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <div className="text-xs font-semibold text-gray-500">Comments Made</div>
                            <div className="mt-1 text-2xl font-bold">{stats.totalCommentsMade}</div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                            <div className="text-xs font-semibold text-gray-500">Memberships</div>
                            <div className="mt-1 text-2xl font-bold">{stats.totalMemberships}</div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
