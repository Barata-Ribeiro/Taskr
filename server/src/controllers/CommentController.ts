import { Request, Response } from "express"
import { validate } from "uuid"
import { CommentResponseDTO } from "../DTOs/task/CommentResponseDTO"
import { BadRequestError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { commentRepository } from "../repositories/CommentRepository"
import { CommentService } from "../services/CommentService"

export class CommentController {
    private commentService: CommentService

    constructor() {
        this.commentService = new CommentService()
    }

    public async createNewComment(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to post a comment.")

        const requestingDataBody = req.body as RequestingCommentDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot post an empty comment.")

        const response = await this.commentService.createNewComment(requestingUser.data.id, taskId, requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Comment posted successfully.",
            data: response
        })
    }

    public async getCommentById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to post a comment.")

        const comment = await commentRepository.findOne({
            where: { id: taskId },
            relations: ["creator", "task"]
        })
        if (!comment) throw new NotFoundError("Comment not found.")

        const response = CommentResponseDTO.fromEntity(comment)

        return res.status(200).json({
            status: "success",
            message: "Comment retrieved successfully.",
            data: response
        })
    }

    public async updateCommentById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to post a comment.")
    }

    public async deleteCommentById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { taskId } = req.params
        if (!taskId) throw new BadRequestError("You must provide a task ID to post a comment.")
    }
}
