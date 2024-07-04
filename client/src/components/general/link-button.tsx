import tw from "@/utils/tw"
import type { Url } from "next/dist/shared/lib/router/router"
import Link from "next/link"
import { type AnchorHTMLAttributes, type ForwardedRef, forwardRef } from "react"
import { twMerge } from "tailwind-merge"

const LinkButton = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ children, className, ...props }, ref: ForwardedRef<HTMLAnchorElement>) => {
        const sortedClasses = tw`cursor-pointer transition-all focus:outline-none`
        const mergedClassName = twMerge(sortedClasses, className)

        return (
            <Link href={props.href as Url} className={mergedClassName} {...props} ref={ref}>
                {children}
            </Link>
        )
    },
)

LinkButton.displayName = "LinkButton"
export default LinkButton
