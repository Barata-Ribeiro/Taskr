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

        if (withMembers) {
            const teams = await team.members
            if (teams) {
                const memberDTOs = teams.map((member) => UserResponseDTO.fromEntity(member))
                dto.members = await Promise.all(memberDTOs)
            } else dto.members = []
        }

        if (withProjects) {
            const projects = await team.projects
            if (projects) {
                const projectDTOs = projects.map(async (project) => await ProjectResponseDTO.fromEntity(project, false))
                dto.projects = await Promise.all(projectDTOs)
            } else dto.projects = []
        }

        dto.createdAt = team.createdAt
        dto.updatedAt = team.updatedAt

        return dto
    }
}
