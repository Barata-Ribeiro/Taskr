import { Request, Response } from "express"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { AuthService } from "../services/AuthService"
import { isMongoIdValid } from "../utils/Validity"

const authService = new AuthService()

export class AuthController {
    async login(req: Request, res: Response) {
        const loginDataBody = req.body as LoginDataBody
        if (!loginDataBody) throw new BadRequestError("You must provide your username and password.")
        if (!loginDataBody.username) throw new BadRequestError("You must provide your username.")
        if (!loginDataBody.password) throw new BadRequestError("You must provide your password.")

        const response = await authService.login(loginDataBody)

        res.cookie("refresh_token", response.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })

        res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
            data: {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            }
        })
    }
    async refreshToken(req: Request, res: Response) {
        const authenticatedUser = req.user
        if (!authenticatedUser) throw new BadRequestError("You must be authenticated to refresh your access token.")
        if (!isMongoIdValid(String(authenticatedUser?._id))) throw new BadRequestError("Invalid user ID.")

        const refreshToken = req.headers["x-refresh-token"] as string
        if (!refreshToken) throw new BadRequestError("You must provide a refresh token.")

        const response = await authService.refreshToken(authenticatedUser._id!, refreshToken)

        res.status(200).json({
            status: "success",
            message: "Your access token has been successfully refreshed.",
            data: {
                accessToken: response
            }
        })
    }
    async logout(req: Request, res: Response) {
        req.user = null
        req.user_role = ""
        req.is_admin = false
        req.is_moderator = false

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.status(200).json({
            status: "success",
            message: "You have successfully logged out."
        })
    }
}
