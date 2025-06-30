import { ShieldAlertIcon } from "lucide-react"

interface DashboardErrorMessageProps {
    message: string
}

export default function DashboardErrorMessage({ message }: Readonly<DashboardErrorMessageProps>) {
    return (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
            <div className="flex">
                <div className="shrink-0">
                    <ShieldAlertIcon aria-hidden="true" className="size-5 text-red-400 dark:text-red-200" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error!</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
