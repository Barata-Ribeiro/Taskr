import { Request, Response } from "express"
import { validate } from "uuid"
import { RequestingTaskDataBody } from "../interfaces/TaskInterface"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { TaskService } from "../services/TaskService"

const taskService = new TaskService()

export class TaskController {
    async createNewTask(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const requestingDataBody = req.body as RequestingTaskDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot create a task without providing the details.")

        const response = await taskService.createNewTask(requestingUser.data.id, requestingDataBody)

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
