import RegisterForm from "@/components/forms/auth/RegisterForm"
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

            <RegisterForm />
        </div>
    )
}
