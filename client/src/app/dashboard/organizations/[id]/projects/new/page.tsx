import NewProjectForm from "@/components/forms/new-project-form"
import NewProjectInfo from "@/components/new-project-info"
import { Metadata } from "next"
import { Fragment } from "react"

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
        <Fragment>
            <NewProjectInfo />

            <section
                id="organization-new-project"
                aria-labelledby="organization-new-project-title"
                className="mx-auto mt-8 max-w-4xl">
                <header className="border-b pb-8">
                    <h1 className="text-lg font-semibold leading-7 text-gray-900">Create a New Project</h1>
                    <p className="mt-1 text-base leading-6 text-gray-600">
                        Fill out the form below to create a new project for your organization. The name, description and
                        deadline are required. You can start managing your project efficiently.
                    </p>
                </header>

                <NewProjectForm orgId={params.id} />
            </section>
        </Fragment>
    )
}
