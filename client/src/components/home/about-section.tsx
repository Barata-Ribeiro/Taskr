import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/react"

export default function AboutSection() {
    return (
        <section
            id="about"
            className="h-screen w-full snap-start bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background-700 via-background-800 to-background-950 py-16">
            <div className="container">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl md:text-center">
                        <h2 className="font-heading text-3xl font-medium tracking-tight text-body-50 sm:text-4xl">
                            <span className="whitespace-nowrap">
                                It’s{" "}
                                <span className="bg-gradient-to-t from-body-600 via-body-400 to-body-600 bg-clip-text font-bold tracking-wide text-transparent">
                                    free
                                </span>
                            </span>{" "}
                            for everyone.
                        </h2>
                        <p className="mt-4 font-body text-lg text-body-200">
                            A personal project made available to everyone. Just start using it!
                        </p>
                    </div>
                </div>

                <TabGroup className="mx-auto mt-24 max-w-3xl" defaultIndex={1}>
                    <TabList className="flex flex-wrap items-center justify-center gap-2 font-heading font-medium md:gap-4">
                        <Tab className="rounded-lg border-background-50/30 px-6 py-1 text-center align-middle text-2xl text-body-200 data-[selected]:border data-[selected]:bg-background-50/20 data-[selected]:text-body-50">
                            About Me
                        </Tab>
                        <Tab className="rounded-lg border-background-50/30 px-6 py-1 text-center align-middle text-2xl text-body-200 data-[selected]:border data-[selected]:bg-background-50/20 data-[selected]:text-body-50">
                            About Taskr
                        </Tab>
                        <Tab className="rounded-lg border-background-50/30 px-6 py-1 text-center align-middle text-2xl text-body-200 data-[selected]:border data-[selected]:bg-background-50/20 data-[selected]:text-body-50">
                            FAQ
                        </Tab>
                    </TabList>
                    <TabPanels className="mt-2 rounded-lg border border-background-50/30 bg-background-50/20 p-4 shadow-nextJS">
                        <TabPanel>
                            <p className="cursor-default rounded-lg p-2 font-body text-xl leading-7 text-body-100 hover:bg-background-50/10">
                                I am Barata Ribeiro. I have a Bachelor&apos;s degree in{" "}
                                <span className="font-semibold text-body-50">Business Administration</span>, with
                                post-graduate studies in{" "}
                                <span className="font-semibold text-body-50">Strategic People Management</span> and{" "}
                                <span className="font-semibold text-body-50">Project Management</span>. I aim to blend
                                strategy and execution, managing visually engaging and practical projects.
                            </p>
                            <p className="mt-4 cursor-default rounded-lg p-2 font-body text-xl leading-7 text-body-100 hover:bg-background-50/10">
                                Currently, I am expanding my horizons into{" "}
                                <span className="font-semibold text-body-50">Full-stack Development</span> and{" "}
                                <span className="font-semibold text-body-50">UI Design</span> through intensive courses,
                                aspiring to create user-friendly interfaces that significantly enhance user experience.
                            </p>
                        </TabPanel>
                        <TabPanel>
                            <p className="cursor-default rounded-lg p-2 font-body text-xl leading-7 text-body-100 hover:bg-background-50/10">
                                <span className="font-semibold text-body-50">Taskr</span> is an open-source project
                                under the <span className="font-semibold text-body-50">GPLv3</span> license, initially
                                created as a personal project using a{" "}
                                <span className="font-semibold text-body-50">RESTful</span> architecture with a backend
                                built in <span className="font-semibold text-body-50">Java Spring Boot</span>. It was
                                developed as a portfolio project to demonstrate my skills. In{" "}
                                <span className="font-semibold text-body-50">Taskr</span>, users can create their own
                                organization, set up projects, and manage tasks for each project.
                            </p>
                        </TabPanel>
                        <TabPanel>
                            <Disclosure>
                                <DisclosureButton className="py-2">Is team pricing available?</DisclosureButton>
                                <DisclosurePanel className="text-gray-500">
                                    Yes! You can purchase a license that you can share with your entire team.
                                </DisclosurePanel>
                            </Disclosure>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </section>
    )
}
