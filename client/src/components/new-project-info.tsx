import Image from "next/image"
import { FaCalendarCheck, FaClipboardList, FaUserGroup } from "react-icons/fa6"
import projectImage from "../../public/images/new-project-image.jpg"

const cards = [
    {
        name: "Project Details",
        description:
            "Provide essential information such as project name, description along with its objectives to get started.",
        icon: FaClipboardList,
    },
    {
        name: "Add Team Members",
        description: "Invite team members to collaborate effectively on the project.",
        icon: FaUserGroup,
    },
    {
        name: "Set Deadlines",
        description: "Define deadlines to ensure timely completion of tasks and project goals.",
        icon: FaCalendarCheck,
    },
]

export default function NewProjectInfo() {
    return (
        <section
            id="new-project-cta"
            aria-labelledby="new-project-cta-title"
            className="relative isolate overflow-hidden rounded-lg bg-gray-900 py-24 shadow-derek sm:py-32">
            <Image
                alt="Man standing in front of people sitting beside table with laptop computers. Photo by Campaign Creators on Unsplash"
                src={projectImage}
                placeholder="blur"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-right mix-blend-multiply md:object-center"
                fill
            />
            <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl">
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                />
            </div>
            <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu">
                <div
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
                />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 id="new-project-cta-title" className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Create a New Project
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Start organizing your tasks and collaborate with your team efficiently. Follow the steps below
                        to set up your project.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
                    {cards.map(card => (
                        <div
                            key={card.name}
                            className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                            <card.icon aria-hidden="true" className="h-7 w-5 flex-none text-english-holly-400" />
                            <div className="text-base leading-7">
                                <h3 className="font-semibold text-white">{card.name}</h3>
                                <p className="mt-2 text-gray-300">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
