import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ObjectId,
    ObjectIdColumn,
    OneToMany,
    UpdateDateColumn
} from "typeorm"
import { Project } from "../project/Project"
import { Task } from "../task/Task"
import { Team } from "../team/Team"
import { UserRole } from "./RoleEnum"

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

    @OneToMany(() => Team, (team) => team.founder, {})
    foundedTeams?: Team[]

    @ManyToMany(() => Team, (team) => team.members, {})
    teams?: Team[]

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
