import ThemeSwitcher from "@/components/ThemeSwitcher"
import tw from "@/utils/tw"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Space_Mono, Work_Sans } from "next/font/google"
import "./globals.css"
import { type ReactNode } from "react"

const spaceMono = Space_Mono({
    variable: "--font-space-mono",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "700"],
})

const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    title: {
        default: "Taskr",
        template: "%s | Taskr",
    },
    description: "A simple task management application for small or medium projects.",
    keywords: ["task management", "project management", "to-do list", "productivity"],
    authors: {
        name: "João Mendes J. B. Ribeiro",
        url: "https://barataribeiro.com/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const bodyClass = tw`${spaceMono.variable} ${workSans.variable} flex min-h-screen flex-col justify-between antialiased`

    return (
        <SessionProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={bodyClass}>
                    <ThemeSwitcher />
                    {children}
                </body>
            </html>
        </SessionProvider>
    )
}
