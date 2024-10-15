import Image from "next/image"
import { FaCircleUser } from "react-icons/fa6"

interface AvatarProps {
    src: string | null
}

export default function Avatar({ src }: Readonly<AvatarProps>) {
    return src ? (
        <Image alt="User Avatar" src={src} className="h-8 w-8 rounded-full bg-gray-50" fill sizes="100vw" />
    ) : (
        <FaCircleUser className="h-8 w-8 text-gray-400" />
    )
}
