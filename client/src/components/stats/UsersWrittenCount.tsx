import { UserCount } from "@/@types/stats"

interface UsersWrittenCountProps {
    data: UserCount
}

export default function UsersWrittenCount({ data }: Readonly<UsersWrittenCountProps>) {
    const { totalUsers, totalLast7Days, totalLast30Days, ...rest } = data

    const percent7 = totalUsers ? ((totalLast7Days / totalUsers) * 100).toFixed(1) : "0"
    const percent30 = totalUsers ? ((totalLast30Days / totalUsers) * 100).toFixed(1) : "0"

    return (
        <div
            className="rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800"
            role="region"
            aria-labelledby="users-stats-heading">
            <h3 id="users-stats-heading" className="me-1 text-xl leading-none font-semibold">
                Users Statics
            </h3>
            <small
                className="mb-4 block border-b border-gray-200 pb-2 text-gray-500 md:mb-6 dark:border-gray-700 dark:text-gray-400"
                aria-live="polite">
                {totalUsers} user(s) in total
            </small>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <dl className="grid items-start gap-2">
                    <dt className="font-medium text-blue-500 dark:text-blue-400" aria-label="Last 7 days">
                        Last 7 days
                    </dt>
                    <dd
                        className="text-sm font-semibold text-blue-600 dark:text-blue-300"
                        aria-label={`${totalLast7Days} users`}>
                        {totalLast7Days} users
                        <span className="ml-2 text-xs font-normal text-blue-400 dark:text-blue-200">({percent7}%)</span>
                    </dd>
                </dl>
                <dl className="grid items-start gap-2">
                    <dt className="font-medium text-green-500 dark:text-green-400" aria-label="Last 30 days">
                        Last 30 days
                    </dt>
                    <dd
                        className="text-sm font-semibold text-green-600 dark:text-green-300"
                        aria-label={`${totalLast30Days} users`}>
                        {totalLast30Days} users
                        <span className="ml-2 text-xs font-normal text-green-400 dark:text-green-200">
                            ({percent30}%)
                        </span>
                    </dd>
                </dl>

                {Object.entries(rest).map(([key, value]) => {
                    const formattedKey = key
                        .replace(/total|role/gi, "")
                        .replace("None", "No Role")
                        .trim()

                    return (
                        <dl key={key} className="grid items-start gap-2">
                            <dt
                                className="font-medium text-gray-500 dark:text-gray-400"
                                aria-label={`Role: ${formattedKey}`}>
                                {formattedKey}
                            </dt>
                            <dd className="text-sm font-semibold" aria-label={`${value} users`}>
                                {value} users
                            </dd>
                        </dl>
                    )
                })}
            </div>
        </div>
    )
}
