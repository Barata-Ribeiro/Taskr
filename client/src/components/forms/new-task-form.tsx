import postCreateNewTask from "@/actions/tasks/post-create-new-task"
import ApiRequestFormProps from "@/components/feedback/api-request-form-error"
import InputValidationError from "@/components/feedback/input-validation-error"
import Spinner from "@/components/helpers/spinner"
import { useForm } from "@/hooks/use-form"
import { ProblemDetails } from "@/interfaces/actions"
import { Button, DialogTitle, Field, Fieldset, Input, Label, Legend, Textarea } from "@headlessui/react"
import { DialogContent } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FaCheck } from "react-icons/fa6"

interface NewTaskFormProps {
    projectId: string
    setIsOpen: (isOpen: boolean) => void
}

export default function NewTaskForm({ projectId, setIsOpen }: NewTaskFormProps) {
    const router = useRouter()
    const { isPending, formState, formAction, onSubmit } = useForm(postCreateNewTask, {
        ok: false,
        error: null,
        response: null,
    })

    useEffect(() => {
        if (formState.ok) router.refresh()
    }, [formState.ok, router])

    const taskPriority = [
        { id: "LOW", title: "Low" },
        { id: "MEDIUM", title: "Medium" },
        { id: "HIGH", title: "High" },
    ]

    return (
        <form action={formAction} onSubmit={onSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <FaCheck aria-hidden="true" className="h-6 w-6 text-green-600" />
                </div>

                <div className="mt-3 sm:mt-5">
                    <DialogTitle as="h3" className="text-center text-base font-semibold leading-6 text-gray-900">
                        Create a new task
                    </DialogTitle>
                    <DialogContent className="mt-2 space-y-6">
                        <Input type="hidden" name="projectId" value={projectId} />
                        <Input type="hidden" name="status" value="OPEN" />
                        <Field>
                            <Label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                                Task Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Example: Build a new feature"
                                required
                                aria-required
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm/6"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                                Task Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="A complete description of the task"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                defaultValue={""}
                                required
                                aria-required
                            />
                        </Field>
                        <Fieldset>
                            <Legend className="text-sm font-semibold leading-6 text-gray-900">Task Priority</Legend>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Set the priority level of the task</p>
                            <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                {taskPriority.map(choice => (
                                    <Field key={choice.id} className="flex items-center">
                                        <Input
                                            defaultChecked={choice.id === "LOW"}
                                            id={choice.id}
                                            name="priority"
                                            type="radio"
                                            value={choice.id}
                                            required
                                            aria-required
                                            className="h-4 w-4 border-gray-300 text-english-holly-600 focus:ring-english-holly-600"
                                        />
                                        <Label
                                            htmlFor={choice.id}
                                            className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                            {choice.title}
                                        </Label>
                                    </Field>
                                ))}
                            </div>
                        </Fieldset>
                        <Fieldset>
                            <Legend className="text-sm font-semibold leading-6 text-gray-900">Task Length</Legend>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Set the start and end date of the task
                            </p>
                            <div className="isolate mt-3 -space-y-px rounded-md shadow-sm">
                                <Field className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                                    <Label htmlFor="startDate" className="block text-xs font-medium text-gray-900">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        aria-required
                                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </Field>
                                <Field className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                                    <Label htmlFor="dueDate" className="block text-xs font-medium text-gray-900">
                                        Due Date
                                    </Label>
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        aria-required
                                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </Field>
                            </div>
                        </Fieldset>
                    </DialogContent>
                </div>

                <div className="mt-3">
                    {formState.error && !Array.isArray(formState.error) && (
                        <ApiRequestFormProps error={formState.error as ProblemDetails} />
                    )}

                    {formState.error && Array.isArray(formState.error) && (
                        <InputValidationError errors={formState.error} />
                    )}
                </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full justify-center rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-700 active:bg-ebony-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 sm:ml-3 sm:w-auto">
                    {isPending ? (
                        <>
                            <Spinner /> Loading...
                        </>
                    ) : (
                        "Create Task"
                    )}
                </Button>
                <Button
                    type="button"
                    disabled={isPending}
                    data-autofocus
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
