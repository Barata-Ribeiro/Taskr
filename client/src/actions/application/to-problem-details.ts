import problemDetailsFactory from "@/utils/problem-details-factory"

const invalidFormData = problemDetailsFactory({
    type: "https://httpstatuses.com/400",
    title: "Invalid Form Data",
    status: 400,
    detail: "Invalid form data was submitted. Please try again.",
    instance: "/auth/login",
})

export { invalidFormData }
