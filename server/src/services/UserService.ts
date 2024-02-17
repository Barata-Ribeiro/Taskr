import bcrypt from "bcrypt"
import { UserResponseDTO } from "../DTOs/user/UserResponseDTO"
import { AppDataSource } from "../database/data-source"
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { checkIfBodyExists } from "../utils/Checker"
import { saveEntityToDatabase } from "../utils/Operations"
import { isEmailValid, isPasswordStrong, isUsernameValid } from "../utils/Validity"

export class UserService {
    async createNewUser(requestingDataBody: RequestingUserDataBody): Promise<UserResponseDTO> {
        checkIfBodyExists(requestingDataBody, ["username", "email", "password"])

        if (!isUsernameValid(requestingDataBody.username))
            throw new BadRequestError(
                "Your username must be between 4 and 20 characters long, and can only contain letters and numbers."
            )

        const checkIfUserExistsByUsername = await userRepository.findOne({
            where: { username: requestingDataBody.username }
        })
        if (checkIfUserExistsByUsername) throw new ConflictError("An user with this username already exists.")

        if (!isEmailValid(requestingDataBody.email)) throw new BadRequestError("You have provided an invalid email.")

        const checkIfUserExistsByEmail = await userRepository.findOne({
            where: { email: requestingDataBody.email }
        })
        if (checkIfUserExistsByEmail) throw new ConflictError("This email is already in use.")

        if (!isPasswordStrong(requestingDataBody.password))
            throw new BadRequestError(
                "Your password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
            )

        const hashedPassword = await bcrypt.hash(requestingDataBody.password, 10)

        const newUser = userRepository.create({
            ...requestingDataBody,
            password: hashedPassword
        })

        const savedNewUser = await saveEntityToDatabase(userRepository, newUser)

        return UserResponseDTO.fromEntity(savedNewUser)
    }

    async updateOwnAccount(id: string, bodyDataWithNewUserInfo: RequestingUserEditDataBody): Promise<UserResponseDTO> {
        const { firstName, lastName, username, email, password, avatarUrl } = bodyDataWithNewUserInfo

        const requestingUser = await userRepository.findOneBy({ id })
        if (!requestingUser) throw new NotFoundError("User not found.")

        if (firstName) requestingUser.firstName = firstName
        if (lastName) requestingUser.lastName = lastName
        if (username) {
            if (!isUsernameValid(username))
                throw new BadRequestError(
                    "Your username must be between 4 and 12 characters long, and can only contain letters and numbers."
                )

            const checkIfUserExistsByUsername = await userRepository.findOneBy({ username })
            if (checkIfUserExistsByUsername) throw new ConflictError("An user with this username already exists.")

            requestingUser.username = username
        }
        if (email) {
            if (!isEmailValid(email)) throw new BadRequestError("You have provided an invalid email.")

            const checkIfUserExistsByEmail = await userRepository.findOneBy({ email })
            if (checkIfUserExistsByEmail) throw new ConflictError("This email is already in use.")

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

        const savedEditedUser = await saveEntityToDatabase(userRepository, requestingUser)

        return UserResponseDTO.fromEntity(savedEditedUser)
    }

    async deleteOwnAccount(id: string): Promise<void> {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const user = await userRepository.findOneBy({ id })
                if (!user) throw new NotFoundError("User not found.")

                await transactionalEntityManager.remove(user)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
