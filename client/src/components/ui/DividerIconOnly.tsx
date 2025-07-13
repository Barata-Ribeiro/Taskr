import { JSX } from "react"

interface DividerIconOnlyProps {
    icon: JSX.ElementType
}

export default function DividerIconOnly({ icon: Icon }: Readonly<DividerIconOnlyProps>) {
    return (
        <div className="relative">
            <div aria-hidden className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-2 dark:bg-gray-900">
                    <Icon aria-hidden className="size-5 text-gray-300 dark:text-gray-700" />
                </span>
            </div>
        </div>
    )
}
