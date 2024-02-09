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
        // ...
    }
    async logout(req: Request, res: Response) {
        // ...
    }
}
