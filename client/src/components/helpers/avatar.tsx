import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface AvatarProps {
    name: string
    size: 32 | 48
    src: string | null
}

export default function Avatar({ name, size, src }: Readonly<AvatarProps>) {
    const sizeStyle = size === 32 ? "h-8 w-8" : "h-12 w-12"
    const textSize = size === 32 ? "text-base" : "text-2xl"

    const placeHolderStyles = twMerge(
        "flex flex-shrink-0 select-none items-center justify-center rounded-full bg-gray-200 shadow-sm",
        sizeStyle,
    )
    const spanStyles = twMerge("font-heading text-gray-500", textSize)

    return src ? (
        <Image
            src={src}
            alt={`Avatar for ${name}`}
            className="flex-shrink-0 rounded-full bg-gray-200 shadow-sm"
            aria-label={`${name}'s avatar`}
            title={`${name}'s avatar`}
            width={size}
            height={size}
            sizes={`${size}px`}
        />
    ) : (
        <div
            className={placeHolderStyles}
            aria-label={`${name}'s avatar placeholder`}
            title={`${name}'s avatar placeholder`}>
            <span className={spanStyles}>{name.charAt(0)}</span>
        </div>
    )
}
