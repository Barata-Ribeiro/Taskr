import { Roles } from "@/@types/user"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface BadgesProps {
    userRole: Roles
}

export default function Badge({ userRole }: Readonly<BadgesProps>) {
    const defaultStyles = tw`inline-flex w-max items-center rounded-full px-2 py-1 text-xs leading-none font-medium capitalize ring-1 select-none ring-inset`

    const roleStyles: Record<Roles, string> = {
        NONE: tw`bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-600/20`,
        USER: tw`bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900 dark:text-blue-200 dark:ring-blue-800/20`,
        ADMIN: tw`bg-yellow-50 text-yellow-700 ring-yellow-600/10 dark:bg-yellow-900 dark:text-yellow-200 dark:ring-yellow-800/20`,
        BANNED: tw`bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900 dark:text-red-200 dark:ring-red-800/20`,
    }

    const normalizedRoled = userRole.toLowerCase()

    return (
        <span
            className={twMerge(defaultStyles, roleStyles[userRole])}
            role="status"
            aria-label={`User role: ${normalizedRoled}`}
            title={`User role: ${normalizedRoled}`}>
            {normalizedRoled}
        </span>
    )
}
