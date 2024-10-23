const BACKEND_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`
export const AUTH_REFRESH_TOKEN = () => `${BACKEND_URL}/api/v1/auth/refresh-token`
export const AUTH_LOGOUT = () => `${BACKEND_URL}/api/v1/auth/logout`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me/context`
export const USER_PATCH_UPDATE_ACCOUNT = (id: string, ra?: boolean) => {
    let url = `${BACKEND_URL}/api/v1/users/me/${id}`
    if (ra) url += `?ra=true`
    return url
}
export const USER_DELETE_ACCOUNT = (id: string) => `${BACKEND_URL}/api/v1/users/me/${id}`

// Organizations
export const ORGANIZATIONS_GET_LIST = (
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/organizations?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}
