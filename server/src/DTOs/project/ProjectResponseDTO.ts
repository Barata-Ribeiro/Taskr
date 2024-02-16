import { Project } from "../../entities/project/Project"
import { UserResponseDTO } from "../user/UserResponseDTO"

export class ProjectResponseDTO {
    id: string
    name: string
    description: string
    creatorId: string
    teamId: string
    members?: UserResponseDTO[]
    createdAt: Date
    updatedAt: Date

    static async fromEntity(project: Project, withProjectMembers?: boolean): Promise<ProjectResponseDTO> {
        const dto = new ProjectResponseDTO()

        dto.id = project.id
        dto.name = project.name
        dto.description = project.description
        dto.creatorId = project.creator.id
        dto.teamId = project.team.id

        if (withProjectMembers) {
            const members = await project.members
            if (members) {
                const memberDTOs = members.map((member) => UserResponseDTO.fromEntity(member))
                dto.members = await Promise.all(memberDTOs)
            } else dto.members = []
        }

        dto.createdAt = project.createdAt
        dto.updatedAt = project.updatedAt

        return dto
    }
}
