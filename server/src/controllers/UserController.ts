import { Request, Response } from "express"
import { UserResponseDTO } from "../DTOs/UserResponseDTO"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
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

    async getAllUsers(_req: Request, res: Response) {
        const users = await userRepository.find()

        const response = users.map((user) => UserResponseDTO.fromEntity(user))

        return res.status(200).json({
            status: "success",
            message: "Users retrieved successfully.",
            data: response
        })
    }

    async getUsersWithPagination({ perPage, page }: UserPaginationRequest, _req: Request, res: Response) {
        let realPage: number
        let realTake: number

        if (perPage) realTake = +perPage
        else {
            perPage = "10"
            realTake = 10
        }

        if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake
        else {
            realPage = 0
            page = "1"
        }

        const queryBuilder = userRepository.createQueryBuilder("user").take(realTake).skip(realPage)

        const [result, total] = await queryBuilder.getManyAndCount()
        const hasNextPage = realPage + realTake < total
        const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:3000"

        return res.status(200).json({
            status: "success",
            message: "Users retrieved successfully.",
            data: result,
            perPage: realTake,
            page: +page || 1,
            next: hasNextPage ? `${backendOrigin}/api/v1/users?perPage=${realTake}&page=${+page + 1}` : null,
            prev: realPage !== 0 ? `${backendOrigin}/api/v1/users?perPage=${realTake}&page=${+page - 1}` : null
        })
    }
}
