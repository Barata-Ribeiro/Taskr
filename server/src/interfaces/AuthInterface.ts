interface LoginDataBody {
    username: string
    password: string
}

interface LoginResponse {
    accessToken: string
    refreshToken: string
}
