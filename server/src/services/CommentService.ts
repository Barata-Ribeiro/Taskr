import { CommentResponseDTO } from "../DTOs/task/CommentResponseDTO"
import { AppDataSource } from "../database/data-source"
import { InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { commentRepository } from "../repositories/CommentRepository"
import { taskRepository } from "../repositories/TaskRepository"
import { userRepository } from "../repositories/UserRepository"
import { saveEntityToDatabase } from "../utils/Operations"

export class CommentService {
    async createNewComment(userId: string, taskId: string, requestingDataBody: RequestingCommentDataBody) {
        const { content } = requestingDataBody

        const user = await userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundError("User does not exist.")

        const task = await taskRepository.findOneBy({ id: taskId })
        if (!task) throw new NotFoundError("Task does not exist.")

        const newComment = await commentRepository.create({
            content,
            creator: user,
            task
        })

        const savedNewComment = await saveEntityToDatabase(commentRepository, newComment)

        return CommentResponseDTO.fromEntity(savedNewComment)
    }

    async updateCommentById(
        userId: string,
        commentId: string,
        taskID: string,
        requestingDataBody: RequestingCommentEditDataBody
    ) {
        const { content } = requestingDataBody

        const comment = await commentRepository.findOne({
            where: { id: commentId, creator: { id: userId }, task: { id: taskID } },
            relations: ["creator", "task"]
        })
        if (!comment) throw new NotFoundError("Comment not found.")

        comment.content = content
        comment.wasEdited = true

        const savedComment = await saveEntityToDatabase(commentRepository, comment)

        return CommentResponseDTO.fromEntity(savedComment)
    }

    async deleteCommentById(userId: string, commentId: string, taskID: string) {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const comment = await commentRepository.findOne({
                    where: { id: commentId, creator: { id: userId }, task: { id: taskID } }
                })
                if (!comment) throw new NotFoundError("Comment not found.")

                await transactionalEntityManager.remove(comment)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
