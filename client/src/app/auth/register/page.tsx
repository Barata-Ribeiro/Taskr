import RegisterForm from "@/components/forms/register-form"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FaCircleInfo } from "react-icons/fa6"
import taskrLogo from "../../../../public/images/logo.svg"

export const metadata: Metadata = {
    title: "Registration",
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
                <div className="bg-white px-6 pb-12 pt-6 shadow-derek sm:rounded-lg sm:px-12">
                    <RegisterForm />
                    <div className="mt-6 border-l-4 border-blue-400 bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaCircleInfo aria-hidden="true" className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    By signing up to create an account, you are accepting our terms of service and
                                    privacy policy.
                                </p>
                            </div>
                        </div>
                    </div>
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
