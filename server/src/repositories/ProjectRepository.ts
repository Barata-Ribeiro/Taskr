import { AppDataSource } from "../database/data-source"
import { Project } from "../entities/Project"

export const projectRepository = AppDataSource.getRepository(Project)
