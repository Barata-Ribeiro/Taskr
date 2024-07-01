import tw from "@/utils/tw"
import type { Metadata } from "next"
import { Nunito, Roboto } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"

const roboto = Roboto({
    display: "swap",
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-roboto",
    weight: ["100", "300", "400", "500", "700", "900"],
})

const nunino = Nunito({
    display: "swap",
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-nunito",
    weight: "variable",
})

export const metadata: Metadata = {
    title: "Taskr",
    description: "Taskr is a simple task manager built for helping you and your team stay organized.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    const sortedStyles = tw`${roboto.variable} ${nunino.variable} text-body-50 dark:bg-background-50 dark:text-body-950 h-full w-full bg-white`

    return (
        <html lang="en">
            <body className={sortedStyles}>{children}</body>
        </html>
    )
}
