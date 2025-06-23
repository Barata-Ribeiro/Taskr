import { ZodIssue } from "zod"

type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>

interface RestResponse<T> {
    status: string
    code: number
    message: string
    data?: T
}

interface InvalidParam {
    fieldName: string
    reason: string
}

interface ProblemDetails {
    type: string
    title: string
    status: number
    detail: string
    instance: string
    "invalid-params"?: InvalidParam[]
}

interface State<T> {
    ok: boolean
    error: string | ValidationError[] | ProblemDetails | null
    response: RestResponse<T> | null
}

interface Paginated<T> {
    content: T[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { ValidationError, RestResponse, InvalidParam, ProblemDetails, State, Paginated }
