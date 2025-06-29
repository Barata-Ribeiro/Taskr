import problemDetailsFactory from "@/utils/problem-details-factory"

const invalidFormData = problemDetailsFactory({
    type: "https://httpstatuses.com/400",
    title: "Invalid Form Data",
    status: 400,
    detail: "Invalid form data was submitted. Please try again.",
    instance: undefined,
})

const unauthenticated = problemDetailsFactory({
    type: "https://httpstatuses.com/401",
    title: "Unauthenticated",
    status: 401,
    detail: "You must be logged in to access this resource.",
    instance: undefined,
})

export { invalidFormData, unauthenticated }
