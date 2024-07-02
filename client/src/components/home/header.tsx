"use client"

import LinkButton from "@/components/general/link-button"
import tw from "@/utils/tw"
import { type MouseEvent, useState } from "react"
import { FaTimes } from "react-icons/fa"
import { FaBars } from "react-icons/fa6"

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = {
        Home: "#hero",
        About: "#about",
        Features: "#features",
        Contact: "#contact",
    }

    const signInClasses = tw`hidden select-none rounded-lg border border-body-50 px-3 py-2 font-heading text-body-50 hover:border-body-100 hover:bg-white/10 hover:text-body-100 active:border-body-200 active:text-body-200 md:inline-block lg:px-6`
    const signUpClasses = tw`hidden select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 font-heading text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 xs:inline-block`

    const toggleMenu = ({ currentTarget }: MouseEvent<HTMLDetailsElement, globalThis.MouseEvent>) => {
        setMenuOpen(prev => !prev)
        if (currentTarget.open && currentTarget.nextElementSibling?.contains(document.activeElement))
            currentTarget.open = false
    }

    return (
        <header className="container fixed inset-0 z-50 mt-2 h-max w-full">
            <div className="flex items-center justify-between rounded-lg border border-background-50/30 bg-white bg-opacity-10 bg-clip-padding p-2 shadow-derek backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
                <h1>LOGO</h1>
                <nav className="hidden items-center gap-2 md:flex lg:gap-4" role="navigation">
                    {Object.entries(navLinks).map(([key, value]) => (
                        <LinkButton
                            key={key + "-" + value}
                            href={value}
                            aria-label={`Scroll to the ${key} section`}
                            className="rounded-lg px-3 py-2 font-heading font-medium text-body-50 hover:bg-white/20 active:bg-white/30">
                            {key}
                        </LinkButton>
                    ))}
                </nav>
                <div className="flex items-center gap-4 font-heading font-medium">
                    <details onClick={toggleMenu} className="relative inline-block select-none md:hidden">
                        <summary className="cursor-pointer list-none rounded-md border border-background-50 p-2 text-body-50 hover:bg-white/10 active:bg-white/20">
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </summary>
                        <ul className="absolute right-2 top-9 z-20 list-none rounded-lg border border-background-50/30 bg-background-950 p-2">
                            {Object.entries(navLinks).map(([key, value]) => (
                                <li key={key + "-" + value}>
                                    <LinkButton
                                        href={value}
                                        aria-label={`Scroll to the ${key} section`}
                                        className="block rounded-lg px-6 py-2 font-heading font-medium text-body-50 hover:bg-white/20 active:bg-white/30">
                                        {key}
                                    </LinkButton>
                                </li>
                            ))}
                        </ul>
                    </details>
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
