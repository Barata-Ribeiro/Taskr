import { AppDataSource } from "../database/data-source"
import { Tag } from "../entities/Tag"

export const tagRepository = AppDataSource.getRepository(Tag)
