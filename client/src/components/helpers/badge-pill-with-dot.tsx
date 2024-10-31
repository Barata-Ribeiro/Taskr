import { UserRoles } from "@/interfaces/user"
import { twMerge } from "tailwind-merge"

interface BadgePillWithDotProps {
    role: UserRoles
}

export default function BadgePillWithDot({ role }: Readonly<BadgePillWithDotProps>) {
    const adjustedRole = role.startsWith("SERVICE") ? role.replace("SERVICE_", "").toLowerCase() : role.toLowerCase()

    const roleColors = {
        none: "gray",
        admin: "red",
        user: "green",
        banned: "yellow",
    }

    const roleColor = roleColors[adjustedRole as keyof typeof roleColors]

    const mergedStyles = twMerge(
        "inline-flex select-none items-center gap-x-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium capitalize",
        `bg-${roleColor}-100 text-${roleColor}-700`,
    )

    return (
        <span className={mergedStyles} aria-label={`User role: ${adjustedRole}`} title={`User role: ${adjustedRole}`}>
            <svg viewBox="0 0 6 6" aria-hidden="true" className={twMerge("h-1.5 w-1.5", `fill-${roleColor}-500`)}>
                <circle r={3} cx={3} cy={3} />
            </svg>
            {adjustedRole}
        </span>
    )
}
