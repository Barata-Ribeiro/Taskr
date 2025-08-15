import { Paginated } from "@/@types/application"
import { User } from "@/@types/user"
import adminGetAllUsersPaginated from "@/actions/admin/admin-get-all-users-paginated"
import dateFormatter from "@/utils/date-formatter"

export default async function LatestUsers() {
    const state = await adminGetAllUsersPaginated({ page: 0, perPage: 10, direction: "DESC", orderBy: "createdAt" })

    const pagination = state.response?.data as Paginated<User>
    const content = pagination.content ?? []

    return (
        <section>
            <h2 className="mb-4 text-2xl font-bold">Latest Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase">
                                Username
                            </th>
                            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium tracking-wider text-gray-500 uppercase">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.map(user => (
                            <tr key={user.username}>
                                <td className="whitespace-no-wrap border-b border-gray-200 px-6 py-4">
                                    {user.username}
                                </td>
                                <td className="whitespace-no-wrap border-b border-gray-200 px-6 py-4">{user.email}</td>
                                <td className="whitespace-no-wrap border-b border-gray-200 px-6 py-4">
                                    {dateFormatter(user.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
