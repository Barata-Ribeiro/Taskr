import { compare } from "bcrypt"
import { JsonWebTokenError, JwtPayload, TokenExpiredError, sign, verify } from "jsonwebtoken"
import { validate } from "uuid"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"

export class AuthService {
    async login(loginDataBody: LoginDataBody): Promise<LoginResponse> {
        const { username, password } = loginDataBody

        const user = await userRepository.findOneBy({ username })
        if (!user) throw new NotFoundError("User not found.")

        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) throw new UnauthorizedError("Invalid password.")

        const secretKey = process.env.JWT_SECRET_KEY
        if (!secretKey)
            throw new NotFoundError(
                "The server is missing its JWT secret key. You should report this issue to the administrator."
            )

        const accessToken = sign({ id: user.id }, secretKey, { expiresIn: "15m" })

        const refreshToken = sign({ id: user.id }, secretKey, {
            expiresIn: loginDataBody.rememberMe ? "30d" : "1d"
        })

        return { accessToken, refreshToken }
    }

    async refreshToken(refreshToken: string): Promise<string> {
        const secretKey = process.env.JWT_SECRET_KEY
        if (!secretKey)
            throw new NotFoundError(
                "The server is missing its JWT secret key. You should report this issue to the administrator."
            )

        let id = ""

        try {
            const payload = verify(refreshToken, secretKey) as JwtPayload
            id = payload.id

            if (!id) throw new NotFoundError("Id not found in token.")
            if (!validate(id)) throw new BadRequestError("Invalid user ID.")
        } catch (error) {
            if (error instanceof TokenExpiredError) throw new UnauthorizedError("Your token has expired.")
            else if (error instanceof JsonWebTokenError) throw new UnauthorizedError("Invalid token.")
        }

        const user = await userRepository.findOneBy({ id })
        if (!user) throw new NotFoundError("User not found.")

        const newAccessToken = sign({ id: user.id }, secretKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m"
        })

        return newAccessToken
    }
}
