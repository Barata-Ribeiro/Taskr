"use client"

import LinkButton from "@/components/general/link-button"
import tw from "@/utils/tw"
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react"
import { FaBars, FaX } from "react-icons/fa6"

export default function Header() {
    const navLinks = {
        Home: "#hero",
        About: "#about",
        Features: "#features",
        Contact: "#contact",
    }

    const signInClasses = tw`hidden select-none rounded-lg border border-body-50 px-3 py-2 font-heading text-body-50 hover:border-body-100 hover:bg-white/10 hover:text-body-100 active:border-body-200 active:text-body-200 md:inline-block lg:px-6`
    const signUpClasses = tw`hidden select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-6 py-2 font-heading text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 xs:inline-block`

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
                    <Menu as="div" className="relative ml-3 md:hidden">
                        <MenuButton className="rounded-md border border-background-50 p-2 text-body-50 hover:bg-white/10 active:bg-white/20">
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
