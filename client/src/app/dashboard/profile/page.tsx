import getUserContext from "@/actions/user/get-user-context"
import { UserContext } from "@/interfaces/user"
import { Button, Field, Fieldset, Input, Label, Legend } from "@headlessui/react"
import Image from "next/image"
import { FaCircleUser } from "react-icons/fa6"

export default async function ProfilePage() {
    const state = await getUserContext()
    if (!state) return <section>ERROR!</section>

    const data = state.response?.data as UserContext

    return (
        <section id="profile-section" aria-labelledby="profile-section-title">
            <div className="mb-6 border-b border-gray-300 pb-6">
                <h1 id="profile-section-title" className="text-lg font-semibold leading-7 text-gray-900">
                    Profile
                </h1>
                <p className="mt-1 text-base leading-6 text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 rounded-md p-4 shadow-derek sm:grid-cols-2">
                <div className="grid gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Basic account information. Edit it quickly and easily.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                        <div className="flex-shrink-0">
                            {data.context.avatarUrl ? (
                                <Image
                                    src={data.context.avatarUrl}
                                    alt="User current avatar"
                                    title="User current avatar"
                                    className="rounded-full shadow"
                                    width={112}
                                    height={112}
                                    sizes="100vw"
                                />
                            ) : (
                                <FaCircleUser
                                    aria-label="Default - No Avatar Setup"
                                    title="Default - No Avatar Setup"
                                    className="h-28 w-28 rounded-full text-gray-400 shadow"
                                />
                            )}
                        </div>

                        <div>
                            <Button
                                type="button"
                                className="rounded-md bg-ebony-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ebony-700 active:bg-ebony-800">
                                Change avatar
                            </Button>
                            <p className="mt-2 text-xs leading-5 text-gray-400">
                                For best results, use an image at least 128px by 128px.
                            </p>
                        </div>
                    </div>

                    <Fieldset className="mt-6 space-y-4">
                        <Legend as="h3" className="grid text-lg font-bold">
                            Full Name{" "}
                            {data.context.fullName && (
                                <span className="text-sm font-medium leading-none text-gray-300">
                                    {data.context.fullName}
                                </span>
                            )}
                        </Legend>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <Label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John/Jane"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </Field>

                            <Field>
                                <Label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </Field>
                        </div>
                    </Fieldset>
                </div>

                <div className="grid gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Password &amp; Security</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Update your password and security settings.
                        </p>
                    </div>

                    <div></div>
                </div>
            </div>
        </section>
    )
}
