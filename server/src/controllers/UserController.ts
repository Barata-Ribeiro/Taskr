import { Request, Response } from "express"
import { validate } from "uuid"
import { UserResponseDTO } from "../DTOs/user/UserResponseDTO"
import { BadRequestError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { UserService } from "../services/UserService"

export class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    async createNewUser(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingUserDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot register without providing your details.")

        const response = await this.userService.createNewUser(requestingDataBody)

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

        const [users, total] = await userRepository.findAndCount({
            order: {
                createdAt: "DESC"
            },
            skip: realPage,
            take: realTake
        })

        const paginatedUsersThroughDTO = users.map((user) => UserResponseDTO.fromEntity(user))

        const hasNextPage = realPage + realTake < total
        const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:3000"

        return res.status(200).json({
            status: "success",
            message: "Users retrieved successfully.",
            data: [...paginatedUsersThroughDTO],
            total,
            perPage: realTake,
            page: +page || 1,
            next: hasNextPage ? `${backendOrigin}/api/v1/users?perPage=${realTake}&page=${+page + 1}` : null,
            prev: realPage !== 0 ? `${backendOrigin}/api/v1/users?perPage=${realTake}&page=${+page - 1}` : null
        })
    }

    async getUserById(req: Request, res: Response) {
        const { userId } = req.params
        if (!validate(userId)) throw new BadRequestError("Invalid user ID.")

        const user = await userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundError("User not found.")

        const response = UserResponseDTO.fromEntity(user)

        return res.status(200).json({
            status: "success",
            message: "User retrieved successfully.",
            data: response
        })
    }

    async updateOwnAccount(req: Request, res: Response) {
        const bodyDataWithNewUserInfo = req.body as RequestingUserEditDataBody
        if (!bodyDataWithNewUserInfo)
            throw new BadRequestError("You cannot update your account without providing at least one field to update.")

        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const response = await this.userService.updateOwnAccount(requestingUser?.id, bodyDataWithNewUserInfo)

        return res.status(200).json({
            status: "success",
            message: "Account updated successfully.",
            data: response
        })
    }

    async deleteOwnAccount(req: Request, res: Response) {
        console.log("Deleting account...")
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to delete your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        console.log("Before entering the service...")
        await this.userService.deleteOwnAccount(requestingUser?.id)

        return res.status(200).json({
            status: "success",
            message: "Account deleted successfully."
        })
    }
}
