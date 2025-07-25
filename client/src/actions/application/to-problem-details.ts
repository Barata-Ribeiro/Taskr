import problemDetailsFactory from "@/utils/problem-details-factory"

const invalidFormData = problemDetailsFactory({
    type: "https://httpstatuses.com/400",
    title: "Invalid Form Data",
    status: 400,
    detail: "Invalid form data was submitted. Please try again.",
    instance: "",
})

const unauthenticated = problemDetailsFactory({
    type: "https://httpstatuses.com/401",
    title: "Unauthenticated",
    status: 401,
    detail: "You must be logged in to access this resource.",
    instance: "",
})

const invalidData = problemDetailsFactory({
    type: "https://httpstatuses.com/400",
    title: "Invalid Data Type",
    status: 400,
    detail: "The provided data is not in the expected format.",
    instance: "",
})

const notFoundToken = problemDetailsFactory({
    type: "https://httpstatuses.com/404",
    title: "Token Not Found",
    status: 404,
    detail: "Authentication token was not found in the cookie store.",
    instance: "",
})

export { invalidFormData, unauthenticated, invalidData, notFoundToken }
