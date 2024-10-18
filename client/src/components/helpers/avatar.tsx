import Image from "next/image"
import { FaCircleUser } from "react-icons/fa6"

interface AvatarProps {
    src: string | null
}

export default function Avatar({ src }: Readonly<AvatarProps>) {
    return src ? (
        <Image
            alt="User Avatar"
            src={src}
            className="aspect-square h-8 w-8 rounded-full bg-gray-50 object-cover"
            width={500}
            height={500}
            quality={50}
        />
    ) : (
        <FaCircleUser className="h-8 w-8 text-gray-400" />
    )
}
