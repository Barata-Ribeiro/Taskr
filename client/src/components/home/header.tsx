"use client"

import LinkButton from "@/components/general/link-button"
import tw from "@/utils/tw"
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react"
import { useEffect, useState } from "react"
import { FaBars, FaX } from "react-icons/fa6"
import { twMerge } from "tailwind-merge"

export default function Header() {
    const [activeTextColor, setActiveTextColor] = useState(false)
    const navLinks = {
        Home: "#hero",
        About: "#about",
        Features: "#features",
        FAQ: "#faq",
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const triggerSections = ["features", "faq"]
    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            let anySectionVisible = false
            entries.forEach(entry => {
                if (entry.isIntersecting && triggerSections.includes(entry.target.id)) {
                    anySectionVisible = true
                }
            })
            setActiveTextColor(anySectionVisible)
        }

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5,
        })

        const sections = document.querySelectorAll("section")
        sections.forEach(section => observer.observe(section))

        return () => sections.forEach(section => observer.unobserve(section))
    }, [triggerSections])

    const activeSignInClasses = activeTextColor
        ? "border-body-700 text-body-700 hover:border-body-600 hover:text-body-600 active:border-body-500 active:text-body-500 hover:bg-black/10"
        : "border-body-50 text-body-50 hover:border-body-100 hover:text-body-100 active:border-body-200 active:text-body-200 hover:bg-white/10"

    const signInClasses = twMerge(
        "hidden select-none rounded-lg border px-3 py-2 font-heading md:inline-block lg:px-6",
        activeSignInClasses,
    )
    const signUpClasses = tw`hidden select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 font-heading text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 xs:inline-block`

    const activeNavColor = activeTextColor
        ? "text-body-950 hover:bg-black/20 active:bg-black/30"
        : "text-body-50 hover:bg-white/20 active:bg-white/30"
    const activeLogoColor = activeTextColor ? "text-body-500" : "text-body-50"
    const activeMenuColor = activeTextColor
        ? "border-background-900 text-body-900 hover:bg-black/10 active:bg-black/20"
        : "border-background-50 text-body-50 hover:bg-white/10 active:bg-white/20"

    const menuButtonClasses = twMerge("rounded-md border p-2", activeMenuColor)

    return (
        <header className="container fixed inset-0 z-50 mt-2 h-max w-full">
            <div className="flex items-center justify-between rounded-lg border border-background-50/30 bg-white/10 bg-clip-padding p-2 shadow-derek backdrop-blur-3xl backdrop-contrast-100 backdrop-saturate-100 backdrop-filter">
                <h1
                    className={twMerge(
                        "select-none font-heading text-2xl font-bold leading-none tracking-wider text-body-50 transition-colors duration-200 ease-in-out",
                        activeLogoColor,
                    )}>
                    TASkR
                </h1>
                <nav className="hidden items-center gap-2 md:flex lg:gap-4" role="navigation" id="header-nav">
                    {Object.entries(navLinks).map(([key, value]) => (
                        <LinkButton
                            key={key + "-" + value}
                            href={value}
                            aria-label={`Scroll to the ${key} section`}
                            className={twMerge("rounded-lg px-3 py-2 font-heading font-medium", activeNavColor)}>
                            {key}
                        </LinkButton>
                    ))}
                </nav>
                <div className="flex items-center gap-4 font-heading font-medium">
                    <Menu as="div" className="relative ml-3 md:hidden">
                        <MenuButton className={menuButtonClasses}>
                            {({ open }) => (open ? <FaX title="Close" size={22} /> : <FaBars title="Open" size={22} />)}
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute right-0 top-12 z-20 origin-top-right space-y-2 rounded-lg border border-background-50/30 bg-background-950 p-2 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                            {Object.entries(navLinks).map(([key, value]) => (
                                <MenuItem key={key + "-" + value}>
                                    <LinkButton
                                        href={value}
                                        aria-label={`Scroll to the ${key} section`}
                                        className="block rounded-lg px-6 py-2 font-heading font-medium text-body-50 hover:bg-white/20 active:bg-white/30">
                                        {key}
                                    </LinkButton>
                                </MenuItem>
                            ))}
                            <MenuSeparator className="h-px bg-white/20" />
                            <MenuItem>
                                <LinkButton
                                    href="/sign/in"
                                    className="block rounded-lg px-6 py-2 font-heading font-medium text-body-50 hover:bg-white/20 active:bg-white/30">
                                    Sign In
                                </LinkButton>
                            </MenuItem>
                            <MenuItem>
                                <LinkButton
                                    href="/sign/up"
                                    className="block rounded-lg bg-background-600 px-6 py-2 font-heading font-medium text-body-50 hover:bg-background-700 active:bg-background-800 xs:hidden">
                                    Sign Up
                                </LinkButton>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
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
