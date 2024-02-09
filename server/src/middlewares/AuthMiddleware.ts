import { NextFunction, Request, Response } from "express"
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken"
import { ObjectId } from "mongodb"
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
        const { _id } = payload

        const userFromDatabase = await userRepository.findOneBy({ _id: new ObjectId(_id) })
        if (!userFromDatabase) throw new NotFoundError("User not found.")

        if (userFromDatabase.role === "BANNED") throw new UnauthorizedError("Your account has been banned.")

        req.user = {
            _id: userFromDatabase._id,
            firstName: userFromDatabase.firstName ?? "",
            lastName: userFromDatabase.lastName ?? "",
            username: userFromDatabase.username,
            email: userFromDatabase.email,
            avatarUrl: userFromDatabase.avatarUrl ?? "",
            createdAt: userFromDatabase.createdAt,
            updatedAt: userFromDatabase.updatedAt
        }
        req.user_role = userFromDatabase.role
        req.is_admin = userFromDatabase.role === "ADMIN"
        req.is_moderator = userFromDatabase.role === "MODERATOR"

        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) next(new UnauthorizedError("Invalid or expired token."))
        else next(error)
    }
}

export default authMiddleware
