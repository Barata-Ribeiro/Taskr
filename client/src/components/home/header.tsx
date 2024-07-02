import Button from "@/components/general/button"
import LinkButton from "@/components/general/link-button"
import tw from "@/utils/tw"
import { FaBars } from "react-icons/fa6"

export default function Header() {
    const navLinks = {
        Home: "#hero",
        About: "#about",
        Features: "#features",
        Contact: "#contact",
    }

    const signInClasses = tw`hidden rounded-lg border border-body-50 px-3 py-2 text-body-50 hover:border-body-100 hover:text-body-100 active:border-body-200 active:text-body-200 md:inline-block lg:px-6`
    const signUpClasses = tw`hidden rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 xs:inline-block`

    return (
        <header className="container fixed inset-0 z-50 mt-2 h-max w-full">
            <div className="flex w-full max-w-full items-center justify-between rounded-lg bg-white bg-opacity-10 bg-clip-padding p-2 shadow-derek backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
                <h1>LOGO</h1>
                <nav className="hidden items-center gap-2 md:flex lg:gap-4" role="navigation">
                    {Object.entries(navLinks).map(([key, value]) => (
                        <LinkButton
                            key={key + "-" + value}
                            href={value}
                            aria-label={`Scroll to the ${key} section`}
                            className="rounded-lg px-3 py-2 font-medium text-body-50 hover:bg-white/20 active:bg-white/30">
                            {key}
                        </LinkButton>
                    ))}
                </nav>
                <div className="flex items-center gap-4 font-heading font-medium">
                    <Button className="inline-block rounded-md border border-background-950 p-2 hover:bg-background-950 focus:bg-background-800 active:bg-background-700 md:hidden">
                        <FaBars />
                    </Button>
                    <LinkButton href="/sign/in" className={signInClasses}>
                        Sign In
                    </LinkButton>
                    <LinkButton href="/sign/up" className={signUpClasses}>
                        Sign Up
                    </LinkButton>
                </div>
            </div>
        </header>
    )
}
