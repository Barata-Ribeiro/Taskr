import { Team } from "../../entities/team/Team"
import { ProjectResponseDTO } from "../project/ProjectResponseDTO"
import { UserResponseDTO } from "../user/UserResponseDTO"

export class TeamResponseDTO {
    id: string
    name: string
    description: string
    founderId: string
    projects?: ProjectResponseDTO[]
    members?: UserResponseDTO[]
    createdAt: Date
    updatedAt: Date

    static async fromEntity(team: Team, withMembers?: boolean, withProjects?: boolean): Promise<TeamResponseDTO> {
        const dto = new TeamResponseDTO()
        dto.id = team.id
        dto.name = team.name
        dto.description = team.description
        dto.founderId = team.founder.id

        if (withMembers)
            dto.members = team.members ? team.members.map((member) => UserResponseDTO.fromEntity(member)) : []

        if (withProjects) {
            const projects = await team.projects
            dto.projects = projects ? projects.map((project) => ProjectResponseDTO.fromEntity(project)) : []
        }

        dto.createdAt = team.createdAt
        dto.updatedAt = team.updatedAt

        return dto
    }
}
