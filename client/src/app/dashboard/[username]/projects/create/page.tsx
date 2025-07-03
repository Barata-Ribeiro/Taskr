import CreateProjectForm from "@/components/forms/project/CreateProjectForm"
import { MoveLeftIcon } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Fragment } from "react"

export const metadata: Metadata = {
    title: "Create Project",
    description: "Create a new project in your dashboard",
}

interface CreateProjectPageProps {
    params: Promise<{ username: string }>
}

export default async function CreateProjectPage({ params }: Readonly<CreateProjectPageProps>) {
    const { username } = await params
    if (!username) return notFound()

    const baseUrl = `/dashboard/${username}`

    return (
        <Fragment>
            <Link
                href={`${baseUrl}/projects`}
                aria-label="Back to Projects"
                title="Back to Projects"
                className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <MoveLeftIcon aria-hidden size={16} /> Back to Projects
            </Link>

            <div className="space-y-6 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                <header className="border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700">
                    <h1 className="text-base font-semibold">Create New Project</h1>
                    <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
                        Use the form below to create a new project. Fill in the necessary details and click
                        &#34;Create&#34; to save your project.
                    </p>
                </header>

                <CreateProjectForm username={username} />
            </div>
        </Fragment>
    )
}
