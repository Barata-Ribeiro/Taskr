import bcrypt from "bcrypt"
import { ObjectId, QueryFailedError } from "typeorm"
import { UserResponseDTO } from "../DTOs/user/UserResponseDTO"
import { AppDataSource } from "../database/data-source"
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { isEmailValid, isPasswordStrong } from "../utils/Validity"

export class UserService {
    async createNewUser(requestingDataBody: RequestingDataBody): Promise<UserResponseDTO> {
        // Check if user already exists
        const checkIfUserExistsByUsername = await userRepository.findOne({
            where: { username: requestingDataBody.username }
        })
        if (checkIfUserExistsByUsername) throw new ConflictError("An user with this username already exists.")

        const checkIfUserExistsByEmail = await userRepository.findOne({
            where: { email: requestingDataBody.email }
        })
        if (checkIfUserExistsByEmail) throw new ConflictError("This email is already in use.")

        // Validate email & password
        if (!isEmailValid(requestingDataBody.email)) throw new BadRequestError("You have provided an invalid email.")
        if (!isPasswordStrong(requestingDataBody.password))
            throw new BadRequestError(
                "Your password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
            )

        // Hash password
        const hashedPassword = await bcrypt.hash(requestingDataBody.password, 10)

        // Create new user
        const newUser = userRepository.create({
            ...requestingDataBody,
            password: hashedPassword
        })

        // Save new user
        try {
            await userRepository.save(newUser)
        } catch (error) {
            if (error instanceof QueryFailedError) throw new ConflictError("Duplicate field value entered.")

            throw new InternalServerError("Internal server error")
        }

        return UserResponseDTO.fromEntity(newUser)
    }

    async updateOwnAccount(
        _id: ObjectId,
        bodyDataWithNewUserInfo: RequestingUserEditDataBody
    ): Promise<UserResponseDTO> {
        const { firstName, lastName, username, email, password, avatarUrl } = bodyDataWithNewUserInfo

        const requestingUser = await userRepository.findOneBy({ _id })
        if (!requestingUser) throw new NotFoundError("User not found.")

        if (firstName) requestingUser.firstName = firstName
        if (lastName) requestingUser.lastName = lastName
        if (username) {
            const checkIfUserExistsByUsername = await userRepository.findOneBy({ username })

            if (checkIfUserExistsByUsername) throw new ConflictError("An user with this username already exists.")
            requestingUser.username = username
        }
        if (email) {
            const checkIfUserExistsByEmail = await userRepository.findOneBy({ email })
            if (checkIfUserExistsByEmail) throw new ConflictError("This email is already in use.")

            if (!isEmailValid(email)) throw new BadRequestError("You have provided an invalid email.")

            requestingUser.email = email
        }
        if (password) {
            if (!isPasswordStrong(password))
                throw new BadRequestError(
                    "Your password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
                )

            const hashedPassword = await bcrypt.hash(password, 10)

            requestingUser.password = hashedPassword
        }
        if (avatarUrl) requestingUser.avatarUrl = avatarUrl

        try {
            await userRepository.save(requestingUser)
        } catch (error) {
            if (error instanceof QueryFailedError) throw new ConflictError("Duplicate field value entered.")

            throw new InternalServerError("Internal server error")
        }

        return UserResponseDTO.fromEntity(requestingUser)
    }

    async deleteOwnAccount(_id: ObjectId): Promise<void> {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const user = await userRepository.findOneBy({ _id })
                if (!user) throw new NotFoundError("User not found.")

                await transactionalEntityManager.remove(user)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
