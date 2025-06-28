import getFallbackInitials from "@/utils/get-fallback-initials"
import Image from "next/image"

interface AvatarProps {
    url?: string
    name: string
}

export default function Avatar({ url, name }: Readonly<AvatarProps>) {
    if (url) {
        return <Image src={url} alt={`Profile picture of ${name}`} className="rounded-full ring-2 ring-white" />
    }

    return (
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-gray-500">
            <span className="font-medium text-white">{getFallbackInitials(name)}</span>
        </span>
    )
}
