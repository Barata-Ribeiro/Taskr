import tw from "@/utils/tw"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
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

const nunito = Nunito({
    display: "swap",
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-nunito",
    weight: "variable",
})

export const metadata: Metadata = {
    title: {
        default: "Taskr",
        template: "%s | Taskr",
    },
    description: "Taskr is a simple task manager built for helping you and your team stay organized.",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const sortedStyles = tw`${roboto.variable} ${nunito.variable} h-full`

    return (
        <html lang="en" className="h-full bg-white dark:bg-gray-950">
            <body className={sortedStyles}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
