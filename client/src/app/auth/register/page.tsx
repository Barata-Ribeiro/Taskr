import { Button, Field, Input, Label } from "@headlessui/react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import taskrLogo from "../../../../public/images/logo.svg"

export const metadata: Metadata = {
    title: "Register",
    description: "Register for a Taskr account",
}

export default function RegisterPage() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image alt="Taskr Logo" src={taskrLogo} className="mx-auto h-10 w-auto" />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
                    Sign up for an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow-derek sm:rounded-lg sm:px-12">
                    <form action="#" method="POST" className="space-y-6">
                        <Field>
                            <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </Label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <Field>
                            <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </Label>
                            <div className="mt-2">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </Field>

                        <div className="flex items-center justify-between">
                            <Field className="flex items-center">
                                <Input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-english-holly-600 focus:ring-english-holly-600"
                                />
                                <Label htmlFor="rememberMe" className="ml-3 block text-sm leading-6 text-gray-900">
                                    Remember me
                                </Label>
                            </Field>

                            <div className="text-sm leading-6">
                                <Link
                                    href="/auth/forgot-password"
                                    className="font-semibold text-ebony-600 decoration-2 underline-offset-4 hover:text-ebony-700 hover:underline active:text-ebony-800">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-ebony-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-ebony-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ebony-600">
                            Sign in
                        </Button>
                    </form>
                </div>

                <p className="mt-10 text-center text-sm text-gray-100">
                    Already a member?{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold leading-6 text-ebony-200 decoration-2 underline-offset-4 hover:text-ebony-300 hover:underline active:text-ebony-400">
                        Sign in with your account
                    </Link>
                </p>
            </div>
        </div>
    )
}