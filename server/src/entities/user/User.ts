import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { Project } from "../project/Project"
import { Task } from "../task/Task"
import { Team } from "../team/Team"
import { UserRole } from "./RoleEnum"

@Entity("taskr_users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

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

    @OneToOne(() => Team, (team) => team.founder, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    foundedTeam?: Promise<Team>

    @ManyToMany(() => Team, (team) => team.members, { lazy: true })
    teams?: Promise<Team[]>

    @OneToMany(() => Project, (project) => project.creator, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    projects?: Promise<Project[]>

    @ManyToMany(() => Project, (project) => project.members, { lazy: true })
    projectMemberships?: Promise<Project[]>

    @OneToMany(() => Task, (task) => task.creator, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    tasks?: Promise<Task[]>

    @ManyToMany(() => Task, (task) => task.assignees, { lazy: true })
    assignedTasks?: Promise<Task[]>

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
