import getFallbackInitials from "@/utils/get-fallback-initials"
import tw from "@/utils/tw"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface AvatarProps {
    url: string | null
    name: string
    size?: "extra-small" | "small" | "medium" | "large" | "extra-large"
}

export default function Avatar({ url, name, size = "small" }: Readonly<AvatarProps>) {
    const sizeClasses = {
        "extra-small": "size-6 text-xs",
        small: "size-8 text-sm",
        medium: "size-10 text-base",
        large: "size-12 text-lg",
        "extra-large": "size-16 text-xl",
    }

    if (!url) {
        const fallbackAvatarClasses = tw`relative inline-flex items-center justify-center rounded-full bg-gray-500 ring-2 ring-white select-none dark:bg-gray-700 dark:ring-gray-400`
        return (
            <span className={twMerge(fallbackAvatarClasses, sizeClasses[size])}>
                <span className="font-medium text-white">{getFallbackInitials(name)}</span>
            </span>
        )
    }

    const avatarClasses = tw`relative inline-block rounded-full object-cover shadow-sm ring-2 ring-white select-none`

    return <Image src={url} alt={`Profile picture of ${name}`} className={twMerge(avatarClasses, sizeClasses[size])} />
}
