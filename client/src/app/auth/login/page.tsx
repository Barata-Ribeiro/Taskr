import LoginForm from "@/components/forms/login-form"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import taskrLogo from "../../../../public/images/logo.svg"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your Taskr account",
}

export default async function LoginPage() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image alt="Taskr Logo" src={taskrLogo} className="mx-auto h-10 w-auto" />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow-derek sm:rounded-lg sm:px-12">
                    <LoginForm />
                </div>

                <p className="mt-10 text-center text-sm text-gray-100">
                    Not a member?{" "}
                    <Link
                        href="/auth/register"
                        className="font-semibold leading-6 text-ebony-200 decoration-2 underline-offset-4 hover:text-ebony-300 hover:underline active:text-ebony-400">
                        Create an account now!
                    </Link>
                </p>
            </div>
        </div>
    )
}
