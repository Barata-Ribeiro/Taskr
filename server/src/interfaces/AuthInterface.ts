interface LoginDataBody {
    username: string
    password: string
    rememberMe: boolean
}

interface LoginResponse {
    accessToken: string
    refreshToken: string
}
