import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import { NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { checkIfBodyExists } from "../utils/Checker"
import { attemptToGetUserIdFromToken } from "../utils/Operations"

export class AuthService {
    async login(loginDataBody: LoginDataBody): Promise<LoginResponse> {
        checkIfBodyExists(loginDataBody, ["username", "password"])
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
        id = attemptToGetUserIdFromToken(refreshToken, secretKey, id)

        const user = await userRepository.findOneBy({ id })
        if (!user) throw new NotFoundError("User not found.")

        const newAccessToken = sign({ id: user.id }, secretKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m"
        })

        return newAccessToken
    }
}
