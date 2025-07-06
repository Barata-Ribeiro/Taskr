import getUserAccount from "@/actions/user/get-user-account"
import DashboardErrorMessage from "@/components/shared/feedback/DashboardErrorMessage"
import dateFormatter from "@/utils/date-formatter"

export default async function AccountInformation() {
    const accountResponse = await getUserAccount()

    if (!accountResponse.ok || !accountResponse.response?.data) {
        return <DashboardErrorMessage message="Failed to load account information. Please try again later." />
    }

    const account = accountResponse.response.data

    return (
        <section className="overflow-hidden rounded-lg bg-white py-5 shadow-sm dark:bg-gray-800">
            <div className="px-4 sm:px-6">
                <h3 className="text-base/7 font-semibold">Account Information</h3>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
                    Your account details and settings
                </p>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 px-4 pt-6 sm:px-6 md:grid-cols-2 dark:border-gray-700">
                <div>
                    <dd className="text-sm font-medium text-gray-500">Full Name</dd>
                    <dt className="text-sm">{account.fullName ?? "Not provided"}</dt>
                </div>
                <div>
                    <dd className="text-sm font-medium text-gray-500">Email</dd>
                    <dt className="text-sm">{account.email}</dt>
                </div>
                <div>
                    <dd className="text-sm font-medium text-gray-500">Username</dd>
                    <dt className="text-sm">@{account.username}</dt>
                </div>
                <div>
                    <dd className="text-sm font-medium text-gray-500">Member Since</dd>
                    <dt className="text-sm">{dateFormatter(account.createdAt)}</dt>
                </div>
            </dl>
        </section>
    )
}
