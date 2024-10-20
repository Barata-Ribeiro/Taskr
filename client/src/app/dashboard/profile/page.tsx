import getUserContext from "@/actions/user/get-user-context"
import DeleteAccount from "@/components/actions/delete-account"
import SignOut from "@/components/actions/sign-out"
import ChangeAccountPassword from "@/components/forms/change-account-password-form"
import UpdateAccountForm from "@/components/forms/update-account-form"
import UpdateAvatarForm from "@/components/forms/update-avatar-form"
import { UserContext } from "@/interfaces/user"

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

            <div className="grid grid-cols-1 gap-6 rounded-md bg-white p-4 shadow-derek sm:grid-cols-2">
                <article aria-labelledby="account-information-title" className="flex flex-col gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 id="account-information-title" className="text-base font-semibold leading-7 text-gray-900">
                            Account Information
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Basic account information. Edit it quickly and easily.
                        </p>
                    </div>

                    <UpdateAvatarForm data={data} />

                    <UpdateAccountForm data={data} />
                </article>

                <article aria-labelledby="password-and-security-title" className="flex flex-col gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2
                            id="password-and-security-title"
                            className="text-base font-semibold leading-7 text-gray-900">
                            Password &amp; Security
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Update your password associated with your account.
                        </p>
                    </div>

                    <ChangeAccountPassword />
                </article>
            </div>

            <article aria-labelledby="danger-zone-title" className="mt-8 grid rounded-md bg-white p-4 shadow-derek">
                <div className="flex flex-col gap-2">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <h2 id="danger-zone-title" className="text-base font-semibold leading-7 text-gray-900">
                            Danger Zone
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            Be careful with the following actions. Bellow you can both logout and/or delete your
                            account. The latter is irreversible.
                        </p>
                    </div>

                    <SignOut />

                    <DeleteAccount />
                </div>
            </article>
        </section>
    )
}
