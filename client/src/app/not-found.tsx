"use client"

import LinkButton from "@/components/general/link-button"
import { Button } from "@headlessui/react"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()
    return (
        <html lang="en" className="h-full w-full">
            <body>
                <main className="grid min-h-full place-items-center bg-white px-6 py-24 font-body sm:py-32 lg:px-8">
                    <div className="text-center">
                        <p className="text-base font-semibold text-body-600">404</p>
                        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-body-900 sm:text-5xl">
                            Page not found
                        </h1>
                        <p className="mt-6 text-base leading-7 text-body-600">
                            Sorry, we couldn’t find the page you’re looking for.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                className="block w-full select-none rounded-lg bg-gradient-to-tl from-primary-500 to-primary-600 px-12 py-3 font-heading text-body-50 hover:from-primary-600 hover:to-primary-700 active:from-primary-700 active:to-primary-800 sm:w-auto lg:px-6">
                                Go back
                            </Button>
                            <LinkButton
                                href="https://github.com/Barata-Ribeiro/Taskr/issues"
                                target="_blank"
                                rel="external noopener noreferrer"
                                className="text-sm font-semibold text-body-900">
                                Contact support <span aria-hidden="true">&rarr;</span>
                            </LinkButton>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
