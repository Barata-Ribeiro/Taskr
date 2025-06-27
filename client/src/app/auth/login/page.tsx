import DefaultButton from "@/components/ui/DefaultButton"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import DefaultInput from "@/components/ui/DefaultInput"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import taskrLogo from "../../../../public/images/logo.svg"

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Taskr account to manage your tasks and projects.",
}

export default function LoginPage() {
    return (
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <header>
                <Image alt="Taskr Logo" src={taskrLogo} className="h-10 w-auto" />
                <h2 className="mt-8 text-2xl/9 font-bold tracking-tight">Sign in to your account</h2>
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                    Not a member?{" "}
                    <Link
                        href="/auth/register"
                        className="font-semibold text-indigo-600 hover:text-indigo-500 active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                        Create a free account
                    </Link>
                </p>
            </header>

            <form action="#" method="POST" className="mt-10 space-y-6">
                <DefaultInput
                    type="text"
                    name="usernameOrEmail"
                    label="Username or Email"
                    description="Access your account using an username or email address."
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    aria-autocomplete="list"
                    required
                    aria-required="true"
                />

                <div className="flex items-center justify-between">
                    <DefaultCheckbox label="Remember me?" name="rememberMe" />

                    <Link
                        href="/auth/forgot-password"
                        className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                        Forgot password?
                    </Link>
                </div>

                <DefaultButton type="submit">Sign in</DefaultButton>
            </form>
        </div>
    )
}
