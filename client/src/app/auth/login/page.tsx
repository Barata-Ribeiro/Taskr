import DefaultButton from "@/components/ui/DefaultButton"
import DefaultCheckbox from "@/components/ui/DefaultCheckbox"
import DefaultInput from "@/components/ui/DefaultInput"
import Image from "next/image"
import Link from "next/link"
import taskrLogo from "../../../../public/images/logo.svg"

export default function LoginPage() {
    return (
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
                <Image alt="Taskr Logo" src={taskrLogo} className="h-10 w-auto" />
                <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-sm/6 text-gray-500">
                    Not a member?{" "}
                    <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Create a free account
                    </Link>
                </p>
            </div>

            <div className="mt-10">
                <div>
                    <form action="#" method="POST" className="space-y-6">
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

                            <div className="text-sm/6">
                                <Link
                                    href="/auth/forgot-password"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500 active:text-indigo-700">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <DefaultButton
                            type="submit"
                            className="flex w-full cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700">
                            Sign in
                        </DefaultButton>
                    </form>
                </div>
            </div>
        </div>
    )
}
