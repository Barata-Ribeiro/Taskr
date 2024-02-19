import { CommentResponseDTO } from "../DTOs/task/CommentResponseDTO"
import { NotFoundError } from "../middlewares/helpers/ApiErrors"
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
}
