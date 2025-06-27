import { ValidationError } from "@/@types/application"
import { CircleX } from "lucide-react"

interface InputValidationErrorProps {
    errors: ValidationError[]
}

export default function InputValidationError({ errors }: Readonly<InputValidationErrorProps>) {
    const errorCount = errors.length
    const isPlural = errorCount > 1
    const errorText = isPlural ? "errors" : "error"
    const verb = isPlural ? "were" : "was"

    return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900">
            <div className="flex">
                <div className="shrink-0">
                    <CircleX className="h-5 w-5 text-red-400 dark:text-red-200" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        There {verb} {errorCount} {errorText} with your submission
                    </h3>
                    <ul className="font-body list-disc space-y-1 pl-5">
                        {errors.map((err, index) => (
                            <li key={`${err.path}_${index}`} className="text-red-600 dark:text-red-200">
                                {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
