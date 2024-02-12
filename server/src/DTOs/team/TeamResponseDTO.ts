import { Team } from "../../entities/team/Team"

export class TeamResponseDTO {
    id: string
    name: string
    description: string
    founderId: string
    createdAt: Date
    updatedAt: Date

    static fromEntity(team: Team): TeamResponseDTO {
        const dto = new TeamResponseDTO()
        dto.id = team.id
        dto.name = team.name
        dto.description = team.description
        dto.founderId = team.founder.id
        dto.createdAt = team.createdAt
        dto.updatedAt = team.updatedAt
        return dto
    }
}
