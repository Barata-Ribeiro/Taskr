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
import { Comment } from "./Comment"
import { TaskPriority } from "./PriorityEnum"
import { Project } from "./Project"
import { TaskStatus } from "./StatusEnum"
import { Tag } from "./Tag"
import { User } from "./User"

@Entity("taskr_tasks")
export class Task {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ unique: true, nullable: false })
    title: string

    @Column({ nullable: false, type: "text" })
    description: string

    @Column({ nullable: false })
    projectId: ObjectId

    @ManyToOne(() => Project, (project) => project.tasks, { eager: false })
    @JoinColumn()
    project: Project

    @Column({ nullable: false })
    creatorId: ObjectId

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
    assigneeId: ObjectId

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
