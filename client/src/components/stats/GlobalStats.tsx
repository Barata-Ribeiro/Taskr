import { ProblemDetails } from "@/@types/application"
import getGlobalStats from "@/actions/stats/get-global-stats"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import { auth } from "auth"
import { ShieldAlert } from "lucide-react"
import { redirect } from "next/navigation"

function ReportPermissionError() {
    return (
        <div
            className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900"
            role="alert"
            aria-live="assertive"
            aria-label="Permission warning">
            <div className="flex">
                <div className="shrink-0">
                    <ShieldAlert aria-hidden className="size-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <div className="ml-3">
                    <h2
                        className="text-sm font-medium text-yellow-800 dark:text-yellow-200"
                        id="global-stats-warning-title">
                        Warning!
                    </h2>
                    <div
                        className="mt-2 text-sm text-yellow-700 dark:text-yellow-300"
                        aria-describedby="global-stats-warning-title">
                        <p>
                            You do not have permission to view global statistics. Only administrators can access this
                            recourse.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default async function GlobalStats() {
    const session = await auth()

    if (!session) redirect("/auth/login")
    if (session.user.role !== "ADMIN") return <ReportPermissionError />

    const globalStatsResponse = await getGlobalStats()
    if (!globalStatsResponse.ok || !globalStatsResponse.response?.data) {
        const isProblemDetails = (globalStatsResponse.error as ProblemDetails)?.type !== undefined
        const errorMessage = isProblemDetails
            ? (globalStatsResponse.error as ProblemDetails).detail
            : "An error occurred while fetching the global statistics."
        return <DashboardErrorMessage message={errorMessage} />
    }

    const globalStats = globalStatsResponse.response.data

    return (
        <section aria-labelledby="global-stats-heading">
            <h2 id="global-stats-heading" className="text-base font-semibold">
                Global Statistics
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
                Here you can find the global statistics for all projects, users, and reports in the system.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</h3>
                    <p className="text-xl font-semibold">{globalStats.totalUsers}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Projects</h3>
                    <p className="text-xl font-semibold">{globalStats.totalProjects}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Tasks</h3>
                    <p className="text-xl font-semibold">{globalStats.totalTasks}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Comments</h3>
                    <p className="text-xl font-semibold">{globalStats.totalComments}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Memberships</h3>
                    <p className="text-xl font-semibold">{globalStats.totalMemberships}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Activities</h3>
                    <p className="text-xl font-semibold">{globalStats.totalActivities}</p>
                </div>
            </div>
        </section>
    )
}
