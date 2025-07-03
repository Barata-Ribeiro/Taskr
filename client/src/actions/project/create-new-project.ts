"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Project } from "@/@types/project"
import ResponseError from "@/actions/application/response-error"
import { invalidFormData, unauthenticated } from "@/actions/application/to-problem-details"
import { createProjectUrl } from "@/helpers/backend-routes"
import { createProjectSchema } from "@/helpers/validation/project-schemas"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function createNewProject(state: State<unknown>, formData: unknown) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        if (!(formData instanceof FormData)) return ResponseError(invalidFormData)

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = createProjectSchema.safeParse(rawFormData)

        if (!parsedFormData.success) return ResponseError(parsedFormData.error)

        const URL = createProjectUrl()

        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag(`my-projects-${session.user?.username}`)

        return { ok: true, error: null, response: json as RestResponse<Project> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
