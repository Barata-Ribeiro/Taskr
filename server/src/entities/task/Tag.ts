import { Column, CreateDateColumn, Entity, ManyToMany, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { Task } from "./Task"

@Entity("taskr_tags")
export class Tag {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ unique: true, nullable: false })
    name: string

    @ManyToMany(() => Task, (task) => task.tags, { lazy: true })
    tasks?: Task[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
