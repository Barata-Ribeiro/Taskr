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

    const signInClasses = tw`hidden rounded-lg border border-body-400 px-3 py-2 text-body-400 hover:border-body-500 hover:text-body-500 focus:ring active:border-body-600 active:text-body-600 md:inline-block lg:px-6`
    const signUpClasses = tw`hidden rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 text-body-50 hover:from-primary-600 hover:to-primary-700 focus:ring active:from-primary-700 active:to-primary-800 xs:inline-block`

    return (
        <header className="container sticky inset-2 z-10 mt-2">
            <div className="flex w-full max-w-full items-center justify-between rounded-lg bg-transparent p-2 shadow-derek backdrop-blur-lg backdrop-saturate-200">
                <h1>LOGO</h1>
                <nav className="hidden items-center gap-2 md:flex lg:gap-4" role="navigation">
                    {Object.entries(navLinks).map(([key, value]) => (
                        <LinkButton
                            key={key + "-" + value}
                            href={value}
                            aria-label={`Scroll to the ${key} section`}
                            className="px-2 py-1 font-medium hover:text-body-600 hover:underline hover:underline-offset-4">
                            {key}
                        </LinkButton>
                    ))}
                </nav>
                <div className="flex items-center gap-4 font-heading font-medium">
                    <Button className="inline-block rounded-md border border-background-950 p-2 hover:bg-background-950 focus:bg-background-800 focus:ring active:bg-background-700 md:hidden">
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
