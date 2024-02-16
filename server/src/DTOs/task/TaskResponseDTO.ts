import { TaskPriority } from "../../entities/task/PriorityEnum"
import { TaskStatus } from "../../entities/task/StatusEnum"
import { Task } from "../../entities/task/Task"
import { UserResponseDTO } from "../user/UserResponseDTO"
import { CommentResponseDTO } from "./CommentResponseDTO"

export class TaskResponseDTO {
    id: string
    title: string
    description: string
    projectId: string
    creatorId: string
    status: TaskStatus
    priority: TaskPriority
    dueDate: Date
    assignees?: UserResponseDTO[]
    comments?: CommentResponseDTO[]
    tags?: {
        id: string
        name: string
    }[]

    static async fromEntity(task: Task, withComments: boolean): Promise<TaskResponseDTO> {
        const dto = new TaskResponseDTO()

        dto.id = task.id
        dto.title = task.title
        dto.description = task.description
        dto.projectId = task.project.id
        dto.creatorId = task.creator.id
        dto.status = task.status
        dto.priority = task.priority
        dto.dueDate = task.dueDate

        const assignees = await task.assignees
        if (assignees) {
            const assigneeDTOs = assignees.map((assignee) => UserResponseDTO.fromEntity(assignee))

            dto.assignees = await Promise.all(assigneeDTOs)
        } else dto.assignees = []

        if (withComments) {
            const comments = await task.comments
            if (comments) {
                const commentDTOs = comments.map((comment) => CommentResponseDTO.fromEntity(comment))

                dto.comments = await Promise.all(commentDTOs)
            } else dto.comments = []
        }

        const tags = await task.tags
        if (tags) {
            const tagDTOs = tags.map((tag) => {
                return { id: tag.id, name: tag.name }
            })

            dto.tags = tagDTOs
        } else dto.tags = []

        return dto
    }
}
