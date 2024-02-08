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
import { Task } from "./Task"
import { User } from "./User"

@Entity("taskr_projects")
export class Project {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ unique: true, nullable: false })
    name: string

    @Column({ nullable: false, type: "text" })
    description: string

    @Column({ nullable: false })
    creatorId: ObjectId

    @ManyToOne(() => User, (user) => user.projects, { eager: false })
    @JoinColumn()
    creator: User

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
