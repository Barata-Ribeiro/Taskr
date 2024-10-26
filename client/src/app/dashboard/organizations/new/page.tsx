import NewOrganizationForm from "@/components/forms/new-organization-form"
import { Metadata } from "next"
import { FaProjectDiagram, FaTasks } from "react-icons/fa"
import { FaFingerprint, FaUsers } from "react-icons/fa6"

export const metadata: Metadata = {
    title: "New Organization",
    description: "Create a new organization in the application so you can start managing your resources and teams.",
}

export default function NewOrgPage() {
    const features = [
        {
            name: "Real-time Collaboration",
            description:
                "Work together with your team simultaneously on tasks and projects, ensuring everyone stays updated.",
            icon: FaUsers,
        },
        {
            name: "Task Management",
            description: "Assign tasks, set priorities, and track progress to ensure projects are completed on time.",
            icon: FaTasks,
        },
        {
            name: "Resource Management",
            description:
                "Manage your resources efficiently by assigning tasks to the right people and ensuring they have the right tools.",
            icon: FaProjectDiagram,
        },
        {
            name: "Advanced security",
            description:
                "Keep your data safe and secure with advanced security features that protect your organization&apos;s data.",
            icon: FaFingerprint,
        },
    ]

    return (
        <section id="organizations-new-org" aria-labelledby="organizations-new-org-title">
            <div className="mx-auto max-w-7xl border-b px-6 pb-8 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 id="organizations-new-org-title" className="text-base font-semibold leading-7 text-ebony-600">
                        A New Beginning
                    </h2>
                    <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
                        Start Managing Your Projects Efficiently
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Let your employees use this platform to enhance your team&apos;s productivity. Create your
                        organization and unlock powerful task management features that will help you manage your teams
                        and projects efficiently.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map(feature => (
                            <div key={feature.name} className="relative sm:pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-english-holly-600 max-sm:hidden">
                                        <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            <NewOrganizationForm />
        </section>
    )
}
