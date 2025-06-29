// backend-routes.ts
import env from "@/helpers/env"

// =================================================================
// =======================  Global Constant  =======================
// =================================================================
const BACKEND_URL = env.BACKEND_ORIGIN ?? "http://localhost:8080"
const API_URL = BACKEND_URL + "/api/v1"

// ================================================================
// ====================  Query Params Builder  ====================
// ================================================================
function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
    const queryParams: string[] = []

    for (const key in params) {
        const value = params[key]
        if (value !== undefined) queryParams.push(`${key}=${value}`)
    }

    return queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
}

// ===============================================================
// ===================  Auth Module Functions  ===================
// ===============================================================
export function registerAuthUrl(): string {
    return `${API_URL}/auth/register`
}

export function loginAuthUrl(): string {
    return `${API_URL}/auth/login`
}

export function refreshTokenAuthUrl(): string {
    return `${API_URL}/auth/refresh-token`
}

export function logoutAuthUrl(): string {
    return `${API_URL}/auth/logout`
}

// ===============================================================
// ===================  User Module Functions  ===================
// ===============================================================
export function userAccountUrl(): string {
    return `${API_URL}/users/me`
}
