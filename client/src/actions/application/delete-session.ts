"use server"

import "server-only"
import { cookies } from "next/headers"

export default async function deleteSession() {
    const cookieStore = await cookies()

    if (cookieStore) cookieStore.getAll().forEach(cookie => cookieStore.delete(cookie.name))

    return {
        ok: true,
        message: "Session cookies deleted successfully",
    }
}
