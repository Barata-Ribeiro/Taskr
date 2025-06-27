import DefaultButton from "@/components/ui/DefaultButton"
import DefaultInput from "@/components/ui/DefaultInput"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import taskrLogo from "../../../../public/images/logo.svg"

export const metadata: Metadata = {
    title: "Register",
    description: "Create a new Taskr account to manage your tasks and projects.",
}

export default function RegisterPage() {
    return (
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <header>
                <Image alt="Taskr Logo" src={taskrLogo} className="h-10 w-auto" />
                <h2 className="mt-8 text-2xl/9 font-bold tracking-tight">Create a new account</h2>
                <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
                    Already a member?{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold text-indigo-600 hover:text-indigo-500 active:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 dark:active:text-indigo-500">
                        Sign in to your account
                    </Link>
                </p>
            </header>

            <form action="#" method="POST" className="mt-10 space-y-6">
                <DefaultInput
                    type="text"
                    label="Username"
                    name="username"
                    placeholder="e.g. john/janedoe"
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="e.g. contact@example.com"
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="text"
                    name="displayName"
                    label="Display Name"
                    placeholder="e.g. John/Jane Doe"
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="password"
                    name="password"
                    label="Password"
                    description="Must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace."
                    autoComplete="new-password"
                    aria-autocomplete="list"
                    required
                    aria-required="true"
                />

                <DefaultInput
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    description="Re-enter your password to confirm."
                    autoComplete="new-password"
                    aria-autocomplete="list"
                    required
                    aria-required="true"
                />

                <DefaultButton type="submit">Sign Up</DefaultButton>
            </form>
        </div>
    )
}
