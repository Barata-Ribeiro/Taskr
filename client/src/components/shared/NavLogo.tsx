import Image from "next/image"
import taskrLogo from "../../../public/images/logo.svg"

export default function NavLogo() {
    return (
        <div className="flex h-16 shrink-0 items-center rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-100">
            <Image alt="Taskr Logo" src={taskrLogo} className="h-8 w-full" />
        </div>
    )
}
