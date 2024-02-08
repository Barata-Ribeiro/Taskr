import { Request, Response } from "express"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { UserService } from "../services/UserService"

const userService = new UserService()

export class UserController {
    async createNewUser(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingDataBody

        if (!requestingDataBody) throw new BadRequestError("You cannot register without providing your details.")
        if (!requestingDataBody.username) throw new BadRequestError("You must provide an username.")
        if (!requestingDataBody.email) throw new BadRequestError("You must provide an email.")
        if (!requestingDataBody.password) throw new BadRequestError("You must provide a password.")

        const response = await userService.createNewUser(requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "User created successfully.",
            data: response
        })
    }
}
