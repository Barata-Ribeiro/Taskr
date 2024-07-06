import { FaInfo } from "react-icons/fa6"

interface ErrorMessageProps {
    error: string
}

export default function ErrorMessage({ error }: Readonly<ErrorMessageProps>) {
    return (
        <div
            className="flex items-center rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert">
            <span className="mr-2 rounded-full bg-red-500 p-1">
                <FaInfo className="text-white" />
            </span>
            <span className="sr-only">Info Alert</span>
            <p className="font-medium">
                <span className="font-bold">Error!</span> {error}
            </p>
        </div>
    )
}
