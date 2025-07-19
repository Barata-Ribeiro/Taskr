"use client"

import { UserCount } from "@/@types/stats"
import { VictoryLabel, VictoryPie, VictoryTheme } from "victory"

interface UsersByVerificationChartProps {
    data: UserCount
}

export default function UsersByVerificationChart({ data }: Readonly<UsersByVerificationChartProps>) {
    const usersByVerification: { x: string; y: number }[] = Object.entries(data)
        .filter(([key]) => key.endsWith("erified"))
        .map(([key, value]) => ({
            x: key.replace("total", ""),
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
            aria-labelledby="users-by-verification-title">
            <h3 id="users-by-verification-title" className="me-1 text-xl leading-none font-semibold">
                Users By Verification
            </h3>
            <small
                className="mb-4 block border-b border-gray-200 pb-2 text-gray-500 md:mb-6 dark:border-gray-700 dark:text-gray-400"
                id="users-by-verification-desc">
                Distribution of users by verification status
            </small>

            <svg
                viewBox={viewBox}
                className="mx-auto block"
                role="img"
                aria-labelledby="users-by-verification-title users-by-verification-desc"
                aria-describedby="users-by-verification-desc"
                focusable="false"
                tabIndex={-1}>
                <title>Users By Verification</title>
                <desc>Distribution of users by verification status</desc>

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
                    text={`Total\n${usersByVerification.reduce((acc, curr) => acc + curr.y, 0)}`}
                    x={(sizes.width - padding.left - padding.right) / 2 + padding.left}
                    y={sizes.height / 2}
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
                            ariaLabel={({ datum }) => `${datum.x}: ${datum.y} users`}
                        />
                    }
                    data={usersByVerification}
                    theme={VictoryTheme.clean}
                />
            </svg>
        </div>
    )
}
