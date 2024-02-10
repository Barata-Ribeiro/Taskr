import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    ObjectId,
    ObjectIdColumn,
    UpdateDateColumn
} from "typeorm"
import { User } from "../user/User"

@Entity("taskr_teams")
export class Team {
    @ObjectIdColumn()
    _id: ObjectId

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false, type: "text" })
    description: string

    @Column({ nullable: false })
    founderId: string

    @ManyToOne(() => User, (user) => user.foundedTeams, { eager: false })
    @JoinColumn()
    founder: User

    @ManyToOne(() => User, (user) => user.teams, { eager: false })
    members: User[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
