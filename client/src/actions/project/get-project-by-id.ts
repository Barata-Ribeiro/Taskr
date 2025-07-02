"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import { CompleteProject } from "@/@types/project"
import ResponseError from "@/actions/application/response-error"
import { unauthenticated } from "@/actions/application/to-problem-details"
import { projectByIdUrl } from "@/helpers/backend-routes"
import { auth } from "auth"

export default async function getProjectById(id: number) {
    const session = await auth()

    try {
        if (!session) return ResponseError(unauthenticated)

        const URL = projectByIdUrl(id)
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            next: { revalidate: 86400, tags: [`project-${id}`] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return { ok: true, error: null, response: json as RestResponse<CompleteProject> }
    } catch (e: unknown) {
        return ResponseError(e)
    }
}
