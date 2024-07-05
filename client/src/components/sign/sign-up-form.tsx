"use client"

import { Button, Field, Input, Label } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { FaLock } from "react-icons/fa6"

export default function SignUpForm() {
    const router = useRouter()

    const { pending } = useFormStatus()
    // const [state, action] = useFormState(signUp, {
    //     ok: false,
    //     clientError: null,
    //     response: null,
    // })

    // useEffect(() => {
    //     if (state.ok) router.push("/sign/in")
    // }, [state.ok, router])

    return (
        <form className="space-y-6" action="">
            <div className="-space-y-px rounded-lg shadow-standard">
                <Field>
                    <Label htmlFor="username" className="sr-only">
                        Username
                    </Label>
                    <Input
                        type="username"
                        id="username"
                        name="username"
                        autoComplete="off"
                        className="form-input relative block w-full appearance-none rounded-none rounded-t-lg border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Username"
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="displayName" className="sr-only">
                        Display name
                    </Label>
                    <Input
                        type="text"
                        id="displayName"
                        name="displayName"
                        className="form-input relative block w-full appearance-none rounded-none border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Display name"
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="email" className="sr-only">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="off"
                        className="form-input relative block w-full appearance-none rounded-none border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Email address"
                        required
                    />
                </Field>
                <Field>
                    <Label htmlFor="password" className="sr-only">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="form-input relative block w-full appearance-none rounded-none rounded-b-lg border border-background-200 px-3 py-2 text-body-950 placeholder-body-200 focus:z-10 focus:border-background-600 focus:outline-none focus:ring-background-600 sm:text-sm"
                        placeholder="Password"
                        required
                    />
                </Field>
            </div>

            <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-background-600 px-4 py-2 text-sm font-medium text-body-50 hover:bg-background-700 focus:outline-none active:bg-background-800">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-body-500 group-hover:text-body-400" aria-hidden="true" />
                </span>
                {pending ? "Creating account..." : "Sign Up"}
            </Button>
        </form>
    )
}
