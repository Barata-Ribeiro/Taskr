import LinkButton from "@/components/general/link-button"
import { FaAnglesUp } from "react-icons/fa6"

export default function Footer() {
    const navLinks = {
        Home: "#hero",
        About: "#about",
        Features: "#features",
        Contact: "#contact",
    }

    return (
        <footer className="bg-gradient-to-tr from-background-50 via-white to-background-50 font-body">
            <div className="container pt-4 text-center sm:pt-0">
                <h2 className="font-heading text-2xl font-extrabold xs:text-3xl sm:text-5xl">Start Managing Now</h2>

                <p className="mx-auto mt-4 max-w-sm leading-relaxed text-body-300 antialiased">
                    Click the button below to start managing your projects and tasks with ease, for free.
                </p>

                <LinkButton
                    href="/sign/up"
                    className="mt-8 inline-block select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 font-heading text-sm font-medium text-body-50 hover:from-primary-600 hover:to-primary-700 focus:ring active:from-primary-700 active:to-primary-800">
                    Get Started
                </LinkButton>
            </div>
            <div className="container relative px-4 pb-4 pt-16 sm:px-6 sm:py-16 lg:px-8 lg:pt-24">
                <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
                    <LinkButton
                        className="inline-block rounded-full bg-primary-500 p-2 text-body-50 shadow transition hover:bg-primary-600 active:bg-primary-700 sm:p-3 lg:p-4"
                        href="#hero">
                        <span className="sr-only">Back to top</span>

                        <FaAnglesUp className="text-base md:text-xl lg:text-2xl" />
                    </LinkButton>
                </div>

                <div className="lg:flex lg:items-end lg:justify-between">
                    <div>
                        <div className="flex justify-center text-accent-600 lg:justify-start">LOGO HERE</div>

                        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-body-400 antialiased lg:text-left">
                            Taskr is a free software that helps you manage your projects and tasks with ease. You are
                            free to use it for personal and commercial projects. Enjoy!
                        </p>
                    </div>

                    <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
                        {Object.entries(navLinks).map(([key, value]) => (
                            <li key={key}>
                                <LinkButton
                                    href={value}
                                    className="font-heading text-body-400 transition hover:text-body-600">
                                    {key}
                                </LinkButton>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="mt-12 text-center text-sm text-body-300 lg:text-right">
                    Copyright &copy; {new Date().getFullYear()}. Some rights reserved -
                    <LinkButton
                        href="https://barataribeiro.com/"
                        className="ml-1"
                        rel="noopener noreferrer"
                        target="_blank"
                        aria-label="Barata-Ribeiro - Portfolio"
                        title="Barata-Ribeiro - Portfolio">
                        Barata-Ribeiro
                    </LinkButton>
                </p>
            </div>
        </footer>
    )
}
