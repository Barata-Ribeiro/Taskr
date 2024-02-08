interface RequestingDataBody {
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
