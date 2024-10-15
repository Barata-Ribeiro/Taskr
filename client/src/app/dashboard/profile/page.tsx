import getUserContext from "@/actions/user/get-user-context"
import { User } from "@/interfaces/user"

export default async function ProfilePage() {
    const state = await getUserContext()
    if (!state) return <section>ERROR!</section>

    const data = state.response?.data as User

    return (
        <section>
            <h1>Profile</h1>
            <p>Welcome, {data.fullName}!</p>
        </section>
    )
}
