import { AppDataSource } from "../database/data-source"
import { Task } from "../entities/task/Task"

export const taskRepository = AppDataSource.getRepository(Task)
