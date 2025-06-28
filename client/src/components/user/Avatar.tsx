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
        "extra-small": "size-6",
        small: "size-8",
        medium: "size-10",
        large: "size-12",
        "extra-large": "size-16",
    }

    if (!url) {
        const fallbackAvatarClasses = tw`inline-flex items-center justify-center rounded-full bg-gray-500`
        return (
            <span className={twMerge(fallbackAvatarClasses, sizeClasses[size])}>
                <span className="font-medium text-white">{getFallbackInitials(name)}</span>
            </span>
        )
    }

    const avatarClasses = tw`rounded-full object-cover shadow-sm ring-2 ring-white`

    return <Image src={url} alt={`Profile picture of ${name}`} className={twMerge(avatarClasses, sizeClasses[size])} />
}
