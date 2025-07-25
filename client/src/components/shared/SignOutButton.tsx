import authLogout from "@/actions/auth/auth-logout"
import Loading from "@/components/shared/feedback/Loading"
import { Button } from "@headlessui/react"
import { LogOutIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Fragment, useTransition } from "react"

function SignoutText() {
    return (
        <Fragment>
            <LogOutIcon aria-hidden size={20} focusable="false" />
            Sign out
        </Fragment>
    )
}

export default function SignOutButton() {
    const { data: session } = useSession()
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleLogout() {
        startTransition(async () => {
            await authLogout()
            router.push("/auth/login")
        })
    }

    return (
        <Button
            type="button"
            onClick={handleLogout}
            disabled={!session || isPending}
            className="inline-flex w-full cursor-pointer items-center gap-x-3 rounded-md px-3 py-2 text-red-700 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:grayscale-100 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-400">
            {!isPending ? <SignoutText /> : <Loading />}
        </Button>
    )
}
