export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 dark:from-gray-900 dark:to-gray-800">
            <section className="w-full max-w-2xl space-y-8 text-center">
                <h1 className="font-heading mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
                    Welcome to Taskr
                </h1>
                <p className="font-body mb-6 text-lg text-gray-700 sm:text-xl dark:text-gray-300">
                    Organize your projects, collaborate with your team, and boost your productivity. Taskr is your
                    all-in-one project management solution.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                        href="/auth/login"
                        className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700">
                        Login
                    </a>
                    <a
                        href="/auth/register"
                        className="rounded-md bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-300 active:bg-gray-800 active:text-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:active:bg-gray-700 dark:active:text-gray-300">
                        Register
                    </a>
                </div>
            </section>
        </main>
    )
}
