import tw from "@/utils/tw"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface BadgeProps {
    variant: "default" | "secondary"
    children: ReactNode
}

export default function Badge({ variant, children }: Readonly<BadgeProps>) {
    const badgeDefaultStyles = tw`inline-flex select-none items-center rounded-full px-2 py-1 text-xs font-medium`
    const badgeColors = variant === "default" ? tw`bg-gray-100 text-gray-600` : tw`bg-gray-800 text-gray-100`
    const badgeStyles = twMerge(badgeDefaultStyles, badgeColors)

    return (
        <span className={badgeStyles} title={children?.toString()}>
            {children}
        </span>
    )
}
