import { AppDataSource } from "../database/data-source"
import { User } from "../entities/user/User"

export const userRepository = AppDataSource.getRepository(User)
