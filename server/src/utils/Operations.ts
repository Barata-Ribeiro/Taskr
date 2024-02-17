import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken"
import { ObjectLiteral, QueryFailedError, Repository } from "typeorm"
import { validate } from "uuid"
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from "../middlewares/helpers/ApiErrors"

export function attemptToGetUserIdFromToken(token: string, key: string, id: string): string {
    try {
        const payload = verify(token, key) as JwtPayload
        id = payload.id

        if (!id) throw new NotFoundError("Id not found in token.")
        if (!validate(id)) throw new BadRequestError("Invalid user ID.")
    } catch (error) {
        if (error instanceof TokenExpiredError) throw new UnauthorizedError("Your token has expired.")
        else if (error instanceof JsonWebTokenError) throw new UnauthorizedError("Invalid token.")
        else throw error
    }

    return id
}

export async function saveEntityToDatabase<T extends ObjectLiteral>(repository: Repository<T>, entity: T): Promise<T> {
    try {
        const result = await repository.save(entity)
        return result
    } catch (error) {
        console.error(`Error saving the ${entity} in repository: `, error)
        if (error instanceof QueryFailedError) throw new ConflictError("Duplicate field value entered.")
        throw new InternalServerError(`An error occurred while saving the entity ${entity}.`)
    }
}
