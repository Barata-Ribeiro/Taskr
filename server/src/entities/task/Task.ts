import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    ObjectId,
    ObjectIdColumn,
    OneToMany,
    UpdateDateColumn
} from "typeorm"
import { Comment } from "../comment/Comment"
import { Project } from "../project/Project"
import { User } from "../user/User"
import { TaskPriority } from "./PriorityEnum"
import { TaskStatus } from "./StatusEnum"
import { Tag } from "./Tag"

@Entity("taskr_tasks")
export class Task {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ unique: true, nullable: false })
    title: string

    @Column({ nullable: false, type: "text" })
    description: string

    @Column({ nullable: false })
    projectId: string

    @ManyToOne(() => Project, (project) => project.tasks, { eager: false })
    @JoinColumn()
    project: Project

    @Column({ nullable: false })
    creatorId: string

    @ManyToOne(() => User, (user) => user.tasks, { eager: false })
    @JoinColumn()
    creator: User

    @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.PLANNED })
    status: TaskStatus

    @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.LOW })
    priority: TaskPriority

    @Column({ nullable: false, type: "timestamp" })
    dueDate: Date

    @OneToMany(() => Comment, (comment) => comment.task)
    comments?: Comment[]

    @Column({ nullable: true })
    assigneeId: string

    @ManyToOne(() => User, (user) => user.assignedTasks, { eager: false })
    @JoinColumn()
    assignee?: User

    @Column({ nullable: true, type: "array" })
    tags?: Tag[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
