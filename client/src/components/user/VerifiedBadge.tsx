import { BadgeCheckIcon } from "lucide-react"

interface VerifiedBadgeProps {
    size?: string | number | undefined
}

export default function VerifiedBadge({ size = 16 }: Readonly<VerifiedBadgeProps>) {
    return (
        <span
            aria-label="Verified User"
            title="Verified user"
            className="inline-flex items-center justify-center rounded-full bg-green-50 p-1 text-green-400 dark:bg-green-900 dark:text-green-300">
            <BadgeCheckIcon aria-hidden size={size} />
        </span>
    )
}
