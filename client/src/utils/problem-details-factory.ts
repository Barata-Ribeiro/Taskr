import { ProblemDetails } from "@/@types/application"

export default function problemDetailsFactory({
    type,
    title,
    status,
    detail,
    instance,
}: ProblemDetails): ProblemDetails {
    return {
        type,
        title,
        status,
        detail,
        instance,
    }
}
