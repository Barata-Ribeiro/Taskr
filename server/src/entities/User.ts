import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, OneToMany, UpdateDateColumn } from "typeorm"
import { Project } from "./Project"
import { UserRole } from "./RoleEnum"
import { Task } from "./Task"

@Entity("taskr_users")
export class User {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ nullable: true })
    firstName?: string

    @Column({ nullable: true })
    lastName?: string

    @Column({ unique: true, nullable: false })
    username: string

    @Column({ unique: true, nullable: false })
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: true })
    avatarUrl?: string

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole

    @OneToMany(() => Project, (project) => project.creator, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    projects?: Project[]

    @OneToMany(() => Task, (task) => task.creator, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    tasks?: Task[]

    @OneToMany(() => Task, (task) => task.assignee, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    assignedTasks?: Task[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
