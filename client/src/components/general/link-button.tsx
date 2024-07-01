import tw from "@/utils/tw"
import type { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link"
import type { AnchorHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export default function LinkButton({
    children,
    className,
    ...props
}: Readonly<AnchorHTMLAttributes<HTMLAnchorElement>>) {
    const sortedClasses = tw`min-h-fit flex-1 select-none focus:outline-none`
    const mergedClassName = twMerge(sortedClasses, className)

    return (
        <Link href={props.href as Url} className={mergedClassName} {...props}>
            {children}
        </Link>
    )
}
