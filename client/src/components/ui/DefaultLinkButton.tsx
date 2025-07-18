import tw from "@/utils/tw"
import Link from "next/link"
import { AnchorHTMLAttributes, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface DefaultLinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: ReactNode
    width?: "full" | "fit" | "auto"
    buttonType?: "color" | "ghost"
    isIconOnly?: boolean
}

export default function DefaultLinkButton({
    children,
    width = "full",
    href,
    buttonType = "color",
    isIconOnly = false,
    ...props
}: Readonly<DefaultLinkButtonProps>) {
    const defaultButtonStyles = tw`inline-flex items-center gap-x-2 rounded-md text-sm/6 font-semibold shadow-xs select-none focus-visible:outline-2 focus-visible:outline-offset-2`

    const typeStyles = {
        color: tw`bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 dark:active:bg-indigo-600`,
        ghost: tw`border border-transparent bg-transparent shadow-none hover:border-gray-200 hover:bg-gray-100 hover:shadow-none focus-visible:outline-gray-200 active:bg-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700`,
    }

    const paddingStyles = isIconOnly ? "p-2.5" : "px-3 py-1.5"

    const widthStyles = {
        full: "w-full",
        fit: "w-fit",
        auto: "w-auto",
    }

    const mergedStyles = twMerge(defaultButtonStyles, paddingStyles, typeStyles[buttonType], widthStyles[width])

    return (
        <Link href={href ?? "#"} className={mergedStyles} {...props}>
            {children}
        </Link>
    )
}
