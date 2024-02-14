import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
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
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true, nullable: false })
    @Index()
    title: string

    @Column({ nullable: false, type: "text" })
    description: string

    @ManyToOne(() => Project, (project) => project.tasks, { eager: false })
    @JoinColumn({ name: "projectId" })
    project: Project

    @ManyToOne(() => User, (user) => user.tasks, { eager: false })
    @JoinColumn({ name: "creatorId" })
    creator: User

    @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.PLANNED })
    status: TaskStatus

    @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.LOW })
    priority: TaskPriority

    @Column({ nullable: false, type: "timestamp" })
    dueDate: Date

    @OneToMany(() => Comment, (comment) => comment.task, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    comments?: Promise<Comment[]>

    @ManyToMany(() => User, (user) => user.assignedTasks, { lazy: true })
    @JoinTable({
        name: "taskr_task_assignees",
        joinColumn: { name: "taskId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "userId", referencedColumnName: "id" }
    })
    assignees?: Promise<User[]>

    @ManyToMany(() => Tag, (tag) => tag.tasks, { cascade: true, eager: true })
    @JoinTable({
        name: "taskr_tasks_tags",
        joinColumn: { name: "taskId" },
        inverseJoinColumn: { name: "tagId" }
    })
    tags?: Promise<Tag[]>

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
