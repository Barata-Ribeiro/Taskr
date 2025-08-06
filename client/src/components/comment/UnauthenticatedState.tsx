import { LockIcon } from "lucide-react"

export default function UnauthenticatedState() {
    return (
        <div className="block w-full max-w-3xl rounded-md bg-gray-100 p-12 text-center select-none dark:bg-gray-900">
            <LockIcon aria-hidden size={40} className="mx-auto block size-10 text-gray-500" />
            <p className="mt-2 block text-sm font-semibold">Sign in to leave a comment</p>
        </div>
    )
}
