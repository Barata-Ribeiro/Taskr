import { ProjectResponseDTO } from "../DTOs/project/ProjectResponseDTO"
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { projectRepository } from "../repositories/ProjectRepository"
import { teamRepository } from "../repositories/TeamRepository"
import { userRepository } from "../repositories/UserRepository"

export class ProjectService {
    async createNewProject(userId: string, requestingDataBody: RequestingProjectDataBody): Promise<ProjectResponseDTO> {
        if (!requestingDataBody.name) throw new BadRequestError("You must provide a name for the project.")
        if (!requestingDataBody.description)
            throw new BadRequestError("You must provide a description for the project.")
        if (!requestingDataBody.teamId) throw new BadRequestError("You must specify the team the project belongs to.")

        const user = await userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundError("User not found.")

        const userProjectAmmount = await projectRepository.countBy({ creator: user })
        if (userProjectAmmount >= 3) throw new ForbiddenError("You have reached the maximum number of projects.")

        const team = await teamRepository.findOneBy({ id: requestingDataBody.teamId })
        if (!team) throw new NotFoundError("Team not found.")

        const newProject = await projectRepository.create({
            name: requestingDataBody.name,
            description: requestingDataBody.description,
            creator: user,
            team: team
        })

        try {
            await projectRepository.save(newProject)
        } catch (error) {
            console.error("Error saving project:", error)
            throw new InternalServerError("An error occurred while creating the project.")
        }

        return ProjectResponseDTO.fromEntity(newProject)
    }

    async getProjectById(projectId: string, userId: string): Promise<ProjectResponseDTO> {
        const user = await userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundError("User not found.")

        const project = await projectRepository.findOne({
            where: { id: projectId },
            relations: ["team"]
        })
        if (!project) throw new NotFoundError("Project not found.")

        const teamMembers = await project.team.members
        const isUserInTeamOfProject = teamMembers.some((member) => member.id === userId)
        if (!isUserInTeamOfProject) throw new ForbiddenError("You are not in the team of this project.")

        return ProjectResponseDTO.fromEntity(project)
    }
}
