import { UserCount } from "@/@types/stats"

interface UsersWrittenCountProps {
    data: UserCount
}

export default function UsersWrittenCount({ data }: Readonly<UsersWrittenCountProps>) {
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
                {data.totalUsers} user(s) in total
            </small>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(data)
                    .filter(([key]) => key !== "totalUsers")
                    .map(([key, value]) => {
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
