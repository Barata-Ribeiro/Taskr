import { AppDataSource } from "../database/data-source"
import { Comment } from "../entities/comment/Comment"

export const commentRepository = AppDataSource.getRepository(Comment)
