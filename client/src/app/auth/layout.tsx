import { auth } from "auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import AuthImage from "../../../public/images/auth-image.avif"

interface AuthLayoutProps {
    children: ReactNode
}

export default async function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
    const session = await auth()
    if (session) redirect(`/dashboard/${session.user.username}`)

    return (
        <main className="flex min-h-full flex-1">
            <section className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                {children}
            </section>

            <section className="relative hidden w-0 flex-1 lg:block">
                <Image
                    src={AuthImage}
                    alt="Laptop on table near cup photo – Free image about Computer on Unsplash, by @andrewtneel"
                    className="inset-0 size-full object-cover"
                    placeholder="blur"
                    sizes="(min-width: 1024px) 100vw, 50vw"
                    priority
                    fill
                />
            </section>
        </main>
    )
}
