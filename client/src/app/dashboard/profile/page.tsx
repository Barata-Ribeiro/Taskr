import getUserContext from "@/actions/user/get-user-context"
import UpdateAccountForm from "@/components/forms/update-account-form"
import UpdateAvatarForm from "@/components/forms/update-avatar-form"
import { UserContext } from "@/interfaces/user"
import { Field, Input, Label } from "@headlessui/react"

export async function generateMetadata() {
    const state = await getUserContext()
    if (!state) return { title: "Profile", description: "Profile page" }

    const data = state.response?.data as UserContext

    const title = data.context.fullName ?? data.context.displayName

    return {
        title: title,
        description: `Welcome back, ${title}! This is your profile page.`,
    }
}

export default async function ProfilePage() {
    const state = await getUserContext()
    if (!state || state.error)
        return (
            <div>
                <h1>Error</h1>
                <p>There was an error loading the page. Please try again later.</p>
            </div>
        )

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
                <div className="flex flex-col gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Basic account information. Edit it quickly and easily.
                        </p>
                    </div>

                    <UpdateAvatarForm data={data} />

                    <UpdateAccountForm data={data} />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Password &amp; Security</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Update your password associated with your account.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Field>
                            <Label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                            />
                        </Field>
                        <Field>
                            <Label
                                htmlFor="confirmNewPassword"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ebony-600 sm:text-sm sm:leading-6"
                            />
                        </Field>
                    </div>
                </div>
            </div>
        </section>
    )
}
