import { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { UserResponseDTO } from "../DTOs/user/UserResponseDTO"
import { BadRequestError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { UserService } from "../services/UserService"
import { isMongoIdValid } from "../utils/Validity"

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
        if (!isMongoIdValid(userId)) throw new BadRequestError("Invalid user ID.")

        const user = await userRepository.findOneBy({ _id: new ObjectId(userId) })
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
        if (!requestingUser?._id) throw new BadRequestError("You must be logged in to update your account.")
        if (!isMongoIdValid(String(requestingUser?._id))) throw new BadRequestError("Invalid user ID.")

        const response = await userService.updateOwnAccount(requestingUser?._id, bodyDataWithNewUserInfo)

        return res.status(200).json({
            status: "success",
            message: "Account updated successfully.",
            data: response
        })
    }
}
