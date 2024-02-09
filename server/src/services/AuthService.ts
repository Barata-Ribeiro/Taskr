import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"
import { NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"

export class AuthService {
    async login(loginDataBody: LoginDataBody): Promise<LoginResponse> {
        const { username, password } = loginDataBody

        const user = await userRepository.findOneBy({ username })
        if (!user) throw new NotFoundError("User not found.")

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new UnauthorizedError("Invalid password.")

        const secretKey = process.env.JWT_SECRET_KEY
        if (!secretKey)
            throw new NotFoundError(
                "The server is missing its JWT secret key. You should report this issue to the administrator."
            )

        const accessToken = sign({ _id: String(user._id) }, secretKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m"
        })

        const refreshToken = sign({ _id: String(user._id) }, secretKey, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION ?? "7d"
        })

        return { accessToken, refreshToken }
    }
}
