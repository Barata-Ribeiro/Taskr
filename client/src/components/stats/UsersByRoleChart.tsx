"use client"

import { UserCount } from "@/@types/stats"
import { VictoryLabel, VictoryPie, VictoryTheme } from "victory"

interface UsersByRoleChartProps {
    data: UserCount
}

export default function UsersByRoleChart({ data }: Readonly<UsersByRoleChartProps>) {
    const userByRole: { x: string; y: number }[] = Object.entries(data)
        .filter(([key, value]) => key.startsWith("totalRole") && value !== 0)
        .map(([key, value]) => ({
            x: key.replace("totalRole", ""),
            y: value as number,
        }))

    const sizes = {
        width: 300,
        height: 300,
        innerRadius: 100,
    }
    const viewBox = `0 0 ${sizes.width} ${sizes.height}`
    const padding = { top: 2, bottom: 2, right: 2, left: 2 }

    return (
        <div
            className="rounded-lg bg-white p-4 shadow-sm md:p-6 dark:bg-gray-800"
            role="region"
            aria-labelledby="users-by-roles-title">
            <h3 id="users-by-roles-title" className="me-1 text-xl leading-none font-semibold">
                Users By Roles
            </h3>
            <small
                className="mb-4 block border-b border-gray-200 pb-2 text-gray-500 md:mb-6 dark:border-gray-700 dark:text-gray-400"
                id="users-by-roles-desc">
                Distribution of users by roles
            </small>

            <svg
                viewBox={viewBox}
                className="mx-auto block"
                role="img"
                aria-labelledby="users-by-roles-title users-by-roles-desc"
                aria-describedby="users-by-roles-desc"
                tabIndex={0}>
                <title>Users By Roles</title>
                <desc>Distribution of users by roles</desc>

                <circle
                    aria-hidden
                    cx={sizes.width / 2}
                    cy={sizes.height / 2}
                    r={sizes.innerRadius}
                    style={{ fill: "oklch(96.70% 0.003 264.54)" }}
                />

                <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 20, fontFamily: "var(--font-space-mono)" }}
                    text={`Total\n${userByRole.reduce((acc, curr) => acc + curr.y, 0)}`}
                    x={(sizes.width - padding.left - padding.right) / 2 + padding.left}
                    y={sizes.height / 2}
                    aria-label={`Total users: ${userByRole.reduce((acc, curr) => acc + curr.y, 0)}`}
                />

                <VictoryPie
                    standalone={false}
                    width={sizes.width}
                    height={sizes.height}
                    padding={padding}
                    innerRadius={sizes.innerRadius}
                    labelRadius={sizes.innerRadius + 18}
                    labelPosition="centroid"
                    labelPlacement="perpendicular"
                    labelComponent={
                        <VictoryLabel
                            style={{
                                fontSize: 12,
                                fontFamily: "var(--font-space-mono)",
                                fill: "oklch(13% 0.028 261.692)",
                            }}
                            aria-label={({ datum }: { datum: { x: string; y: number } }) =>
                                `${datum.x}: ${datum.y} users`
                            }
                        />
                    }
                    data={userByRole}
                    theme={VictoryTheme.material}
                />
            </svg>
        </div>
    )
}
