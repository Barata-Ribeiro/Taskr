import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"

interface DefaultSkeletonProps {
    className?: string
}

export default function DefaultSkeleton({ className }: Readonly<DefaultSkeletonProps>) {
    const defaultStyle = tw`animate-pulse rounded bg-gray-200 dark:bg-gray-700`
    return <div className={twMerge(defaultStyle, className)} />
}
