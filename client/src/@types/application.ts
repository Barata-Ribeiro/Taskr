import { $ZodIssue } from "zod/v4/core"

type ValidationError = Partial<Pick<$ZodIssue, "path" | "message">>

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

interface QueryParams {
    page?: number
    perPage?: number
    direction?: "ASC" | "DESC"
    orderBy?: string
}

interface Page {
    size: number
    number: number
    totalElements: number
    totalPages: number
}

interface Paginated<T> {
    content: T[]
    page: Page
}

export type { ValidationError, RestResponse, InvalidParam, ProblemDetails, State, QueryParams, Paginated, Page }
