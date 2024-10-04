import getUserContext from "@/actions/user/get-user-context"
import { UserContextProvider } from "@/context/user-context-provider"
import { User } from "@/interfaces/user"
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

const nunito = Nunito({
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const sortedStyles = tw`${roboto.variable} ${nunito.variable}`

    const state = await getUserContext()
    const user = state.response?.data as User

    return (
        <html lang="en" className="h-full !overflow-y-auto !p-0">
            <UserContextProvider user={user}>
                <body className={sortedStyles}>{children}</body>
            </UserContextProvider>
        </html>
    )
}
