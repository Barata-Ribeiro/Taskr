import { notFound } from "next/navigation"

interface ProfilePageProps {
    params: Promise<{ username: string; name: string }>
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
    const { username, name } = await params
    if (!username || !name) return notFound()

    return <div></div>
}
