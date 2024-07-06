import { State } from "@/interfaces/actions"

export default function ResponseError(error: unknown): State {
    const state: State = {
        ok: false,
        clientError: null,
        response: null,
    }

    console.error(error)

    return {
        ...state,
        clientError: error instanceof Error ? error.message : "An error occurred. Please try again.",
    }
}
