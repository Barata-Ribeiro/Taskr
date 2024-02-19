import { Request, Response } from "express"
import { validate } from "uuid"
import { RequestingTaskDataBody, RequestingTaskEditDataBody } from "../interfaces/TaskInterface"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { TaskService } from "../services/TaskService"

export class TaskController {
    private taskService: TaskService

    constructor() {
        this.taskService = new TaskService()
    }

    async createNewTask(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const requestingDataBody = req.body as RequestingTaskDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot create a task without providing the details.")

        const response = await this.taskService.createNewTask(requestingUser.data.id, requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Task created successfully.",
            data: response
        })
    }

    async getAllTasks(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("You must provide a project ID to retrieve tasks.")

        const response = await this.taskService.getAllTasks(requestingUser.data.id, projectId)

        return res.status(200).json({
            status: "success",
            message: "Tasks retrieved successfully.",
            data: response
        })
    }

    async getTaskById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("You must provide a project ID to retrieve tasks.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to retrieve a task.")

        const response = await this.taskService.getTaskById(requestingUser.data.id, projectId, taskId)

        return res.status(200).json({
            status: "success",
            message: "Task retrieved successfully.",
            data: response
        })
    }

    async updateTaskById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("You must provide a project ID to retrieve tasks.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to retrieve a task.")

        const requestingDataBody = req.body as RequestingTaskEditDataBody
        if (!requestingDataBody)
            throw new BadRequestError("You cannot update a task without providing at least one detail.")

        const response = await this.taskService.updateTaskById(
            requestingUser.data.id,
            projectId,
            taskId,
            requestingDataBody
        )

        return res.status(200).json({
            status: "success",
            message: "Task updated successfully.",
            data: response
        })
    }

    async deleteTaskById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("You must provide a project ID to retrieve tasks.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to retrieve a task.")

        const response = await this.taskService.deleteTaskById(requestingUser.data.id, projectId, taskId)

        return res.status(200).json({
            status: "success",
            message: "Task deleted successfully.",
            data: response
        })
    }
}
