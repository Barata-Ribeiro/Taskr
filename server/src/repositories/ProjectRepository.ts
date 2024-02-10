import { AppDataSource } from "../database/data-source"
import { Project } from "../entities/project/Project"

export const projectRepository = AppDataSource.getRepository(Project)
