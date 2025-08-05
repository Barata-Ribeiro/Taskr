import { Author } from "@/@types/user"

interface Comment {
    id: number
    content: string
    author: Author
    taskId: number
    parentId?: number
    childrenCount: number
    children: Comment[]
    createdAt: string
    updatedAt: string
}

export type { Comment }
