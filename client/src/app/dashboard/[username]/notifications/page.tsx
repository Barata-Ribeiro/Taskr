import { QueryParams } from "@/@types/application"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface NotificationsPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Notifications",
    description: "Manage your notifications here.",
}

export default async function NotificationsPage({ params, searchParams }: Readonly<NotificationsPageProps>) {
    const [{ username }, pageParams] = await Promise.all([params, searchParams])
    if (!username) notFound()
    if (!pageParams) return null

    const { page = 0, perPage = 10, direction = "DESC", orderBy = "createdAt" } = pageParams as QueryParams
    return <section></section>
}
