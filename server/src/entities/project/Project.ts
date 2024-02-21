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
import { Task } from "../task/Task"
import { Team } from "../team/Team"
import { User } from "../user/User"

@Entity("taskr_projects")
export class Project {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true, nullable: false })
    @Index({ unique: true })
    name: string

    @Column({ nullable: false, type: "text" })
    description: string

    @ManyToOne(() => User, (user) => user.projects, { eager: false })
    @JoinColumn({ name: "creatorId" })
    creator: User

    @ManyToOne(() => Team, (team) => team.projects, { eager: false })
    @JoinColumn({ name: "teamId" })
    team: Team

    @ManyToMany(() => User, (user) => user.projectMemberships, { lazy: true })
    @JoinTable({
        name: "taskr_project_members",
        joinColumn: { name: "projectId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "userId", referencedColumnName: "id" }
    })
    members: Promise<User[]>

    @OneToMany(() => Task, (task) => task.project, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    tasks: Promise<Task[]>

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
