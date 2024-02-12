interface RequestingUserDataBody {
    firstName?: string
    lastName?: string
    username: string
    email: string
    password: string
}

interface UserPaginationRequest {
    perPage: string
    page: string
}

interface RequestingUserEditDataBody {
    firstName?: string
    lastName?: string
    username?: string
    email?: string
    password?: string
    avatarUrl?: string
}
