import Loading from "@/components/shared/feedback/Loading"
import SignOutButton from "@/components/shared/SignOutButton"
import Avatar from "@/components/user/Avatar"
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react"
import { ChevronsUpDownIcon, LucideProps, SettingsIcon, UserPenIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react"

interface UserMenuProps {
    isAvatarOnly?: boolean
    anchor?: ComponentProps<typeof MenuItems>["anchor"]
}

interface UserNavigationItem {
    name: string
    href: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

interface UserProfile {
    href: string
    settingsHref: string
    avatarUrl: string | null
    name: string
    label: string
}

export default function UserMenu({ isAvatarOnly = false, anchor }: Readonly<UserMenuProps>) {
    const { data: session, status } = useSession()

    if (status === "loading") return <Loading />
    if (!session) return null

    const profile: UserProfile = {
        href: `/dashboard/${session.user.username}/profile/${session.user.username}`,
        settingsHref: `/dashboard/${session.user.username}/settings`,
        avatarUrl: session.user.avatarUrl ?? null,
        name: session.user.username,
        label: `Open user menu for ${session.user.username}`,
    }

    const userNavigation: UserNavigationItem[] = [
        { name: "Profile", href: profile.href, icon: UserPenIcon },
        { name: "Settings", href: profile.settingsHref, icon: SettingsIcon },
    ]

    return (
        <Menu>
            {!isAvatarOnly ? (
                <MenuButton
                    aria-label={profile.label}
                    className="inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                    <div className="inline-flex items-center gap-x-3">
                        <Avatar url={profile.avatarUrl} name={profile.name} size="small" />
                        <span className="flex-1">{profile.name}</span>
                    </div>

                    <ChevronsUpDownIcon aria-hidden size={16} />
                </MenuButton>
            ) : (
                <MenuButton aria-label={profile.label} title={profile.label} className="cursor-pointer">
                    <Avatar name={profile.name} url={profile.avatarUrl} size="small" />
                </MenuButton>
            )}

            <MenuItems
                transition
                anchor={anchor}
                className="w-52 origin-top-right rounded-xl border border-gray-200 bg-white p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 dark:border-gray-700 dark:bg-gray-800">
                {userNavigation.map(item => (
                    <MenuItem key={item.name}>
                        <Link
                            href={item.href}
                            className="flex items-center gap-x-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400">
                            <item.icon aria-hidden size={16} />
                            {item.name}
                        </Link>
                    </MenuItem>
                ))}

                <MenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

                <MenuItem>
                    <SignOutButton />
                </MenuItem>
            </MenuItems>
        </Menu>
    )
}
