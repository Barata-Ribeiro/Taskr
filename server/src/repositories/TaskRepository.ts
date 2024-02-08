import { AppDataSource } from "../database/data-source"
import { Task } from "../entities/Task"

export const taskRepository = AppDataSource.getRepository(Task)
