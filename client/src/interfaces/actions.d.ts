export interface ApiResponse {
    status: string
    code: number
    message: string
    data?: unknown
}

export interface State {
    ok: boolean
    clientError: string | null
    response: ApiResponse | null
}
