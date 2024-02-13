import { Request, Response } from "express"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { TaskService } from "../services/TaskService"

const taskService = new TaskService()

export class TaskController {
    async createNewTask(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingTaskDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot create a task without providing the details.")
        if (!requestingDataBody.title) throw new BadRequestError("You must provide a title for the task.")
        if (!requestingDataBody.description) throw new BadRequestError("You must provide a description for the task.")
        if (!requestingDataBody.projectId)
            throw new BadRequestError("You must specify the project the task belongs to.")
        if (!requestingDataBody.dueDate) throw new BadRequestError("You must specify the due date for the task.")

        const response = await taskService.createNewTask(requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Task created successfully.",
            data: response
        })
    }

    async getAllTasks(req: Request, res: Response) {
        // TODO: Implement this method
    }

    async getTaskById(req: Request, res: Response) {
        // TODO: Implement this method
    }

    async updateTaskById(req: Request, res: Response) {
        // TODO: Implement this method
    }

    async deleteTaskById(req: Request, res: Response) {
        // TODO: Implement this method
    }
}
