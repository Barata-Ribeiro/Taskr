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
import { Task } from "../task/Task"
import { Team } from "../team/Team"
import { User } from "../user/User"

@Entity("taskr_projects")
export class Project {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ unique: true, nullable: false })
    name: string

    @Column({ nullable: false, type: "text" })
    description: string

    @ManyToOne(() => User, (user) => user.projects, { eager: false })
    @JoinColumn({ name: "creatorId" })
    creator: User

    @ManyToOne(() => Team, (team) => team.projects, { eager: false })
    @JoinColumn({ name: "teamId" })
    team: Team

    @OneToMany(() => Task, (task) => task.project, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    tasks: Task[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
