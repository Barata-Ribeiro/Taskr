import { AppDataSource } from "../database/data-source"
import { Tag } from "../entities/task/Tag"

export const tagRepository = AppDataSource.getRepository(Tag)
