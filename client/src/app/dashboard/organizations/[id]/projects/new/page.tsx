import NewProjectForm from "@/components/forms/new-project-form"
import { Metadata } from "next"

interface NewProjectPageProps {
    params: {
        id: string
    }
}

export const metadata: Metadata = {
    title: "New Project",
    description:
        "Create a new project in the application for the organization so you can start managing your" +
        " resources and teams.",
}

export default function NewProjectPage({ params }: Readonly<NewProjectPageProps>) {
    return (
        <section
            id="organization-new-project"
            aria-labelledby="organization-new-project-title"
            className="mx-auto max-w-7xl">
            <header className="border-b pb-8">
                <h1 className="text-lg font-semibold leading-7 text-gray-900">Create a New Project</h1>
                <p className="mt-1 text-base leading-6 text-gray-600">
                    Fill out the form below to create a new project for your organization. The name, description and
                    deadline are required. You can start managing your project efficiently.
                </p>
            </header>

            <NewProjectForm orgId={params.id} />
        </section>
    )
}
