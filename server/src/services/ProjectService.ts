import { validate } from "uuid"
import { ProjectResponseDTO } from "../DTOs/project/ProjectResponseDTO"
import { AppDataSource } from "../database/data-source"
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

        newProject.members = Promise.resolve([user])

        try {
            await projectRepository.save(newProject)
        } catch (error) {
            console.error("Error saving project:", error)
            throw new InternalServerError("An error occurred while creating the project.")
        }

        return ProjectResponseDTO.fromEntity(newProject)
    }

    async getProjectById(withProjectMembers: boolean, projectId: string, userId: string): Promise<ProjectResponseDTO> {
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

        return ProjectResponseDTO.fromEntity(project, withProjectMembers)
    }

    async updateProjectById(
        userId: string,
        projectId: string,
        requestingDataBody: RequestingProjectEditDataBody
    ): Promise<ProjectResponseDTO> {
        const wereUsersAdded = requestingDataBody.userIds && requestingDataBody.userIds.length > 0

        const project = await projectRepository.findOne({
            where: { id: projectId },
            relations: ["team", "creator", wereUsersAdded ? "members" : ""]
        })
        if (!project) throw new NotFoundError("Project not found.")

        const isUserOwnerOfProject = project.creator.id === userId
        if (!isUserOwnerOfProject) throw new ForbiddenError("You are not the owner of this project.")

        if (requestingDataBody.name) project.name = requestingDataBody.name
        if (requestingDataBody.description) project.description = requestingDataBody.description
        if (requestingDataBody.userIds) {
            const invalidUserIds = requestingDataBody.userIds.filter((id) => !validate(id))
            if (invalidUserIds.length > 0)
                throw new BadRequestError(
                    `Invalid user IDs: ${invalidUserIds.join(", ")}. \n\n Please provide valid user IDs.`
                )

            let membersToAdd = []
            const currentMembers = await project.members
            for (const memberId of requestingDataBody.userIds) {
                const isAlreadyAMember = currentMembers.some((member) => member.id === memberId)
                if (isAlreadyAMember)
                    throw new BadRequestError(
                        `User with ID ${memberId} is already a member of the project. Make sure to select only members who are not already in the project.`
                    )

                const userToBeAdd = await userRepository.findOneBy({ id: memberId })
                if (!userToBeAdd) throw new NotFoundError(`User with ID ${memberId} not found.`)

                membersToAdd.push(userToBeAdd)
            }

            project.members = Promise.resolve([...currentMembers, ...membersToAdd])
        }

        try {
            await projectRepository.save(project)
        } catch (error) {
            console.error("Error saving project:", error)
            throw new InternalServerError("An error occurred while updating the project.")
        }

        return ProjectResponseDTO.fromEntity(project, wereUsersAdded ? true : false)
    }

    async deleteProjectById(userId: string, projectId: string): Promise<void> {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const project = await projectRepository.findOne({
                    where: { id: projectId },
                    relations: ["creator"]
                })
                if (!project) throw new NotFoundError("Project not found.")

                const isUserOwnerOfProject = project.creator.id === userId
                if (!isUserOwnerOfProject) throw new ForbiddenError("You are not the owner of this project.")

                await transactionalEntityManager.remove(project)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
