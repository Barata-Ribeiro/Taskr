import { compare } from "bcrypt"
import { JwtPayload, sign, verify } from "jsonwebtoken"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { isMongoIdValid } from "../utils/Validity"

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

        const accessToken = sign({ _id: String(user._id) }, secretKey, { expiresIn: "15m" })

        const refreshToken = sign({ _id: String(user._id) }, secretKey, {
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

        const payload = verify(refreshToken, secretKey) as JwtPayload
        const { _id } = payload

        if (!isMongoIdValid(String(_id))) throw new BadRequestError("Invalid user ID.")

        const user = await userRepository.findOneBy({ _id })
        if (!user) throw new NotFoundError("User not found.")

        const newAccessToken = sign({ _id: String(user._id) }, secretKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m"
        })

        return newAccessToken
    }
}
