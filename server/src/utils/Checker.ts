import { BadRequestError } from "../middlewares/helpers/ApiErrors"

export const checkIfBodyExists = <T>(body: T, requiredFields: (keyof T)[]): void => {
    const missingFields = requiredFields.filter((field) => !body[field])

    const adjustedMissingFields = missingFields.map((field) => {
        if (field === "teamId") return "Team it belongs to"
        if (field === "projectId") return "Project it belongs to"
        if (field === "dueDate") return "Due date"
        return field.toString().charAt(0).toUpperCase() + field.toString().slice(1)
    })

    if (adjustedMissingFields.length > 0)
        throw new BadRequestError(`You must specify the following fields: ${adjustedMissingFields.join(", ")}`)
}
