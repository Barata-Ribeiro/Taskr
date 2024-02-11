import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    ObjectId,
    ObjectIdColumn,
    UpdateDateColumn
} from "typeorm"
import { Task } from "../task/Task"
import { User } from "../user/User"

@Entity("taskr_comments")
export class Comment {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ nullable: false, type: "text" })
    content: string

    @ManyToOne(() => Task, (task) => task.comments, { eager: false })
    @JoinColumn({ name: "taskId" })
    task: Task

    @ManyToOne(() => User, (user) => user.tasks, { eager: false })
    @JoinColumn({ name: "creatorId" })
    creator: User

    @Column({ type: "boolean", default: false })
    wasEdited: boolean

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}