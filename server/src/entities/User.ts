import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm"
import { UserRole } from "./Roles"

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

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
    updatedAt: Date
}
