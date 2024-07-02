import LinkButton from "@/components/general/link-button"
import tw from "@/utils/tw"
import { twMerge } from "tailwind-merge"
import heroImage from "../../../public/images/hero-image.jpg"

export default function HeroSection() {
    const blurClasses = tw`bg-background-50 bg-opacity-20 bg-clip-padding backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter`
    const heroClasses = twMerge(
        blurClasses,
        tw`max-w-2xl rounded-lg border border-background-50/30 p-6 text-center shadow-nextJS md:text-left`,
    )
    return (
        <section
            id="hero"
            style={{ backgroundImage: `url(${heroImage.src})` }}
            className="relative snap-start bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-background-900/60 sm:bg-transparent sm:bg-gradient-to-tl sm:from-background-900/35 sm:to-background-900/25"></div>

            <div className="container relative z-0 mx-auto py-32 lg:flex lg:h-screen lg:items-center">
                <div className={heroClasses}>
                    <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
                        Start your project
                        <br /> with{" "}
                        <strong className="bg-gradient-to-bl from-body-50 via-body-200 to-body-400 bg-clip-text font-heading text-transparent">
                            Taskr.
                        </strong>
                    </h1>

                    <p className="mt-4 max-w-lg text-left font-body text-white sm:text-xl/relaxed">
                        A free and open-source project management tool that helps you organize your work and life. Start
                        today!
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 text-center align-middle font-medium antialiased">
                        <LinkButton
                            href="/sign/up"
                            className="block w-full select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-12 py-3 font-heading text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 sm:w-auto lg:px-6">
                            Get Started
                        </LinkButton>

                        <LinkButton
                            href="#about"
                            className="block w-full select-none rounded-lg border border-body-50 px-12 py-3 font-heading text-body-50 hover:border-body-100 hover:bg-white/10 hover:text-body-100 active:border-body-200 active:text-body-200 sm:w-auto lg:px-6">
                            Learn More
                        </LinkButton>
                    </div>
                </div>
            </div>
        </section>
    )
}
