import { Comment } from "../../entities/comment/Comment"

export class CommentResponseDTO {
    id: string
    content: string
    taskId: string
    creatorId: string
    wasEdited: boolean
    createdAt: Date
    updatedAt: Date

    static async fromEntity(comment: Comment): Promise<CommentResponseDTO> {
        const dto = new CommentResponseDTO()

        dto.id = comment.id
        dto.content = comment.content
        dto.taskId = comment.task.id
        dto.creatorId = comment.creator.id
        dto.wasEdited = comment.wasEdited
        dto.createdAt = comment.createdAt
        dto.updatedAt = comment.updatedAt

        return dto
    }
}
