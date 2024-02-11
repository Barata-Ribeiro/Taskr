import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { Project } from "../project/Project"
import { User } from "../user/User"

@Entity("taskr_teams")
export class Team {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true, nullable: false })
    @Index()
    name: string

    @Column({ nullable: false, type: "text" })
    description: string

    @ManyToOne(() => User, (user) => user.foundedTeam, { eager: false })
    @JoinColumn({ name: "founderId" })
    founder: User

    @OneToMany(() => Project, (project) => project.team, {
        cascade: true,
        lazy: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    projects: Project[]

    @ManyToMany(() => User, (user) => user.teams, { eager: false })
    members: User[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
