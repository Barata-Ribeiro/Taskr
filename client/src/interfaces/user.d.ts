export interface User {
    id: string
    username: string
    displayName: string
    firstName: string
    lastName: string
    email: string
    role: "NONE" | "SERVICE_ADMIN" | "SERVICE_USER" | "BANNED"
    createdAt: string
    updatedAt: string
}
