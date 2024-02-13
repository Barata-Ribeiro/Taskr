import { Project } from "../../entities/project/Project"

export class ProjectResponseDTO {
    id: string
    name: string
    description: string
    creatorId: string
    teamId: string
    createdAt: Date
    updatedAt: Date

    static async fromEntity(project: Project): Promise<ProjectResponseDTO> {
        const dto = new ProjectResponseDTO()
        dto.id = project.id
        dto.name = project.name
        dto.description = project.description
        dto.creatorId = project.creator.id
        dto.teamId = project.team.id
        dto.createdAt = project.createdAt
        dto.updatedAt = project.updatedAt

        return dto
    }
}
