import { auth } from "@/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
}

export default async function HomePage() {
    const session = await auth()

    return (
        <section>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user.username}!</p>
        </section>
    )
}
