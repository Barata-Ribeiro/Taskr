import { Request, Response } from "express"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { AuthService } from "../services/AuthService"

const authService = new AuthService()

export class AuthController {
    async login(req: Request, res: Response) {
        const loginDataBody = req.body as LoginDataBody
        if (!loginDataBody) throw new BadRequestError("You must provide your username and password.")
        if (!loginDataBody.username) throw new BadRequestError("You must provide your username.")
        if (!loginDataBody.password) throw new BadRequestError("You must provide your password.")

        const response = await authService.login(loginDataBody)

        // If rememberMe === true then set the expiration to 30 days, otherwise set it to 1 day
        const REMEMBER_ME_EXPIRATION = loginDataBody.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000

        res.cookie("refresh_token", response.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: REMEMBER_ME_EXPIRATION
        })

        res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
            data: {
                accessToken: response.accessToken
            }
        })
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.headers["x-refresh-token"] as string
        if (!refreshToken) throw new BadRequestError("You must provide a refresh token.")

        const response = await authService.refreshToken(refreshToken)

        res.status(200).json({
            status: "success",
            message: "Your access token has been successfully refreshed.",
            data: {
                accessToken: response
            }
        })
    }

    async logout(req: Request, res: Response) {
        req.user.data = null
        req.user.is_admin = false
        req.user.is_moderator = false
        req.user.is_in_team = false

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
