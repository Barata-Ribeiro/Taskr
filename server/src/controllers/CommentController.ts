import { Request, Response } from "express"
import { validate } from "uuid"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
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
        // TODO...
    }

    public async updateCommentById(req: Request, res: Response) {
        // TODO...
    }

    public async deleteCommentById(req: Request, res: Response) {
        // TODO...
    }
}
