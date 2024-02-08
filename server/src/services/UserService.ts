import bcrypt from "bcrypt"
import { QueryFailedError } from "typeorm"
import { UserResponseDTO } from "../DTOs/UserResponseDTO"
import { BadRequestError, ConflictError, InternalServerError } from "../middlewares/helpers/ApiErrors"
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
}
