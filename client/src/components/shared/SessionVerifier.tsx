"use client"

import deleteSession from "@/actions/application/delete-session"
import { Route } from "next"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export default function SessionVerifier() {
    const router = useRouter()
    const { data: session, update } = useSession()

    const logout = useCallback(() => {
        console.error("There was an error with the session, logging out...")

        const handleSignOut = async () => {
            await signOut({ redirect: false })
            router.push(`${window.location.origin}/auth/login` as Route<string>)
        }

        const handleDeleteSession = async () => {
            try {
                const response = await deleteSession()
                console.log(response.message)
            } catch (error) {
                console.error(error)
            } finally {
                await handleSignOut()
            }
        }

        update()
            .then(() => handleDeleteSession())
            .catch(console.error)
    }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") logout()
    }, [session, logout])

    return null
}
