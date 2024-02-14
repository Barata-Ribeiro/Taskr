import { NextFunction, Request, Response } from "express"
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken"
import { validate } from "uuid"
import { userRepository } from "../repositories/UserRepository"
import { NotFoundError, UnauthorizedError } from "./helpers/ApiErrors"

const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        if (!authorization) throw new UnauthorizedError("Authorization header is required.")

        const token = authorization.split(" ")[1]
        if (!token) throw new UnauthorizedError("Your request is missing an authorization token.")

        const secretKey = process.env.JWT_SECRET_KEY
        if (!secretKey)
            throw new NotFoundError(
                "The server is missing its JWT secret key. You should report this issue to the administrator."
            )

        const payload = verify(token, secretKey) as JwtPayload
        const { id } = payload
        if (!id) throw new NotFoundError("Id not found in token.")
        if (!validate(id)) throw new UnauthorizedError("Invalid id in token.")

        const userFromDatabase = await userRepository.findOneBy({ id })
        if (!userFromDatabase) throw new NotFoundError("User not found.")

        const userTeams = await userFromDatabase.teams

        if (userFromDatabase.role === "BANNED") throw new UnauthorizedError("Your account has been banned.")

        if (!req.user) req.user = { data: null, is_admin: false, is_moderator: false, is_in_team: false }

        req.user.data = {
            id: userFromDatabase.id,
            username: userFromDatabase.username,
            email: userFromDatabase.email,
            role: userFromDatabase.role,
            createdAt: userFromDatabase.createdAt,
            updatedAt: userFromDatabase.updatedAt
        }
        req.user.is_admin = userFromDatabase.role === "ADMIN"
        req.user.is_moderator = userFromDatabase.role === "MODERATOR"
        req.user.is_in_team = userTeams !== undefined && userTeams.length > 0

        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) next(new UnauthorizedError("Your token has expired."))
        else if (error instanceof JsonWebTokenError) next(new UnauthorizedError("Invalid token."))
        else next(error)
    }
}

export default authMiddleware
