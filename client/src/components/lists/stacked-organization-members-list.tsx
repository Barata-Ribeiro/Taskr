import { Paginated } from "@/interfaces/actions"
import { OrganizationMember } from "@/interfaces/user"
import Image from "next/image"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"

interface StackedOrganizationMembersListProps {
    data: Paginated<OrganizationMember>
}

function MemberAvatar(props: Readonly<{ pivot: OrganizationMember }>) {
    return (
        <>
            {props.pivot.user.avatarUrl ? (
                <Image
                    src={props.pivot.user.avatarUrl}
                    alt={props.pivot.user.fullName}
                    width={48}
                    height={48}
                    sizes="48px"
                />
            ) : (
                <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
                    aria-label={`${props.pivot.user.fullName ?? props.pivot.user.displayName} avatar placeholder`}>
                    <span className="font-heading text-xl text-gray-500">
                        {(props.pivot.user.fullName ?? props.pivot.user.displayName).charAt(0)}
                    </span>
                </div>
            )}
        </>
    )
}

function MemberBadge(props: Readonly<{ pivot: OrganizationMember }>) {
    return (
        <>
            {props.pivot.roles.includes("Owner") ? (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    Owner
                </span>
            ) : (
                ((props.pivot.roles.includes("Admin") && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Admin
                    </span>
                )) ?? (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Member
                    </span>
                ))
            )}
        </>
    )
}

export default function StackedOrganizationMembersList({ data }: Readonly<StackedOrganizationMembersListProps>) {
    return (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-900/5">
            {data.content.map(pivot => (
                <li
                    key={pivot.user.email}
                    className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                    <div className="flex min-w-0 gap-x-4">
                        <MemberAvatar pivot={pivot} />

                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                <Link href={`/dashboard/profile/${pivot.user.id}`}>
                                    <span className="absolute inset-x-0 -top-px bottom-0" />
                                    {pivot.user.fullName ?? pivot.user.displayName}
                                </Link>
                            </p>
                            <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                <Link href={`mailto:${pivot.user.email}`} className="relative truncate hover:underline">
                                    {pivot.user.email}
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-x-4">
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                            <MemberBadge pivot={pivot} />
                        </div>
                        <FaChevronRight aria-hidden="true" className="h-3 w-3 flex-none text-gray-400" />
                    </div>
                </li>
            ))}
        </ul>
    )
}
