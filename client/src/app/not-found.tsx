import { Metadata } from "next"
import Link from "next/link"
import notFoundImage from "../../public/images/not-found.jpg"
import Image from "next/image"

export const metadata: Metadata = {
    title: "404 - Not Found",
    description: "This page does not exist.",
}

export default function NotFound() {
    return (
        <main className="relative isolate flex min-h-full flex-col justify-between">
            <Image
                src={notFoundImage}
                alt="Table with chairs near the wall in a dark room photo. Photo by Jonny Clow on Unsplash."
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
                quality={100}
                priority
                fill
            />
            <div className="mx-auto mt-8 max-w-7xl justify-self-center px-6 text-center lg:px-8">
                <p className="text-base font-semibold leading-8 text-gray-50">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-50 sm:text-5xl">Page not found</h1>
                <p className="mt-4 text-base text-gray-200 sm:mt-6">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-10 flex justify-center">
                    <Link
                        href="/"
                        className="rounded-md px-4 py-2 text-sm font-semibold leading-7 text-gray-50 hover:bg-transparent hover:backdrop-blur-md hover:backdrop-filter active:backdrop-brightness-125">
                        <span aria-hidden="true">&larr;</span> Back to home
                    </Link>
                </div>
            </div>

            <footer className="mb-8 w-full justify-self-center text-center text-gray-50">
                <p>
                    Copyright &copy; {new Date().getFullYear()}. Some rights reserved. — By
                    <Link
                        href="https://barataribeiro.com/"
                        className="ml-1 text-gray-50 underline-offset-2 hover:text-gray-100 hover:underline active:text-gray-200"
                        rel="external noopener noreferrer"
                        target="_blank"
                        aria-label="Barata-Ribeiro - Portfolio"
                        title="Barata-Ribeiro - Portfolio">
                        Barata Ribeiro
                    </Link>
                </p>
            </footer>
        </main>
    )
}
