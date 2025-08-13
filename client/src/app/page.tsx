import { auth } from "@/auth"
import DefaultLinkButton from "@/components/ui/DefaultLinkButton"
import { Fragment } from "react"

export default async function HomePage() {
    const session = await auth()
    const isAuthenticated = Boolean(session?.user?.id)

    const dashboardUrl = `/dashboard/${session?.user.username}`

    const features = [
        { title: "Real-time", desc: "Instant updates across your team with live syncing." },
        { title: "Readable", desc: "Clean interface that keeps focus on the work." },
        { title: "Actionable", desc: "Drag & drop tasks, assign owners, track progress." },
        { title: "Insightful", desc: "Built‑in stats to spot blockers early." },
    ]

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-20 dark:from-gray-900 dark:to-gray-800"
            id="main-content"
            aria-label="Homepage main content">
            <section className="w-full max-w-5xl space-y-14 text-center">
                {/* Hero */}
                <header className="space-y-8" aria-label="Taskr introduction">
                    <h1 className="font-heading mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                        Plan. Track. Deliver. Together.
                    </h1>
                    <p className="font-body mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl dark:text-gray-400">
                        Taskr helps you turn ideas into shipped work faster. Organize projects, collaborate in real
                        time, and stay focused with an intuitive, lightweight workspace.
                    </p>

                    <nav
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                        aria-label={isAuthenticated ? "Dashboard navigation" : "Authentication navigation"}>
                        {isAuthenticated ? (
                            <DefaultLinkButton href={dashboardUrl} width="fit" aria-label="Go to Dashboard">
                                Go to Dashboard
                            </DefaultLinkButton>
                        ) : (
                            <Fragment>
                                <DefaultLinkButton href="/auth/login" width="fit" aria-label="Login to your account">
                                    Login
                                </DefaultLinkButton>
                                <DefaultLinkButton
                                    href="/auth/register"
                                    width="fit"
                                    buttonType="ghost"
                                    aria-label="Register a new account">
                                    Register
                                </DefaultLinkButton>
                            </Fragment>
                        )}
                    </nav>

                    {!isAuthenticated && (
                        <p className="text-sm text-gray-500 dark:text-gray-500" aria-live="polite">
                            No credit card required. Start organizing in minutes.
                        </p>
                    )}
                </header>

                {/* Feature highlights */}
                <section
                    className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    aria-labelledby="feature-highlights-heading">
                    <h2 id="feature-highlights-heading" className="sr-only">
                        Feature highlights
                    </h2>
                    {features.map(f => (
                        <div
                            key={f.title}
                            className="group rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-indigo-500"
                            aria-label={`${f.title}: ${f.desc}`}>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Secondary CTA for unauthenticated users */}
                {!isAuthenticated && (
                    <section
                        className="mx-auto max-w-2xl rounded-md border border-dashed border-gray-300 p-6 dark:border-gray-700"
                        aria-label="Sign up call to action">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Move faster today</h2>
                        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                            Create your free account and start organizing tasks, projects, and priorities with zero
                            setup.
                        </p>
                        <nav
                            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                            aria-label="Sign up navigation">
                            <DefaultLinkButton href="/auth/register" width="fit" aria-label="Get started free">
                                Get Started Free
                            </DefaultLinkButton>
                            <DefaultLinkButton
                                href="/auth/login"
                                width="fit"
                                buttonType="ghost"
                                aria-label="I already have an account">
                                I already have an account
                            </DefaultLinkButton>
                        </nav>
                    </section>
                )}
            </section>
        </main>
    )
}
