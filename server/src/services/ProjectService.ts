import { ProjectResponseDTO } from "../DTOs/project/ProjectResponseDTO"
import { AppDataSource } from "../database/data-source"
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { projectRepository } from "../repositories/ProjectRepository"
import { teamRepository } from "../repositories/TeamRepository"
import { userRepository } from "../repositories/UserRepository"
import { checkIfBodyExists } from "../utils/Checker"
import { saveEntityToDatabase } from "../utils/Operations"

export class ProjectService {
    async createNewProject(userId: string, requestingDataBody: RequestingProjectDataBody): Promise<ProjectResponseDTO> {
        checkIfBodyExists(requestingDataBody, ["name", "description", "teamId"])

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

        const savedNewProject = await saveEntityToDatabase(projectRepository, newProject)

        return ProjectResponseDTO.fromEntity(savedNewProject)
    }

    async getProjectById(withProjectMembers: boolean, projectId: string, userId: string): Promise<ProjectResponseDTO> {
        const user = await userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundError("User not found.")

        let project

        if (withProjectMembers)
            project = await projectRepository.findOne({
                where: { id: projectId },
                relations: ["team", "creator", "members"]
            })
        else project = await projectRepository.findOne({ where: { id: projectId }, relations: ["team", "creator"] })

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
        const wereUsersAdded = requestingDataBody.usersUsername && requestingDataBody.usersUsername.length > 0

        const project = await projectRepository.findOne({
            where: { id: projectId },
            relations: ["team", "creator", wereUsersAdded ? "members" : ""]
        })
        if (!project) throw new NotFoundError("Project not found.")

        const isUserOwnerOfProject = project.creator.id === userId
        if (!isUserOwnerOfProject) throw new ForbiddenError("You are not the owner of this project.")

        if (requestingDataBody.name) project.name = requestingDataBody.name
        if (requestingDataBody.description) project.description = requestingDataBody.description
        if (wereUsersAdded) {
            const currentMembers = (await project.members) || []

            if (currentMembers.length + requestingDataBody.usersUsername!.length > 15)
                throw new BadRequestError("You can't have more than 15 members in a project.")

            const membersToAdd = await Promise.all(
                requestingDataBody.usersUsername!.map(async (username) => {
                    const user = await userRepository.findOneBy({ username })
                    if (!user) throw new NotFoundError(`User with username ${username} not found.`)

                    if (currentMembers.some((member) => member.username === user.username))
                        throw new BadRequestError(username + " is already a member of this project.")

                    return user
                })
            )

            project.members = Promise.resolve([...currentMembers, ...membersToAdd])
        }

        const savedEditedProject = await saveEntityToDatabase(projectRepository, project)

        return ProjectResponseDTO.fromEntity(savedEditedProject, wereUsersAdded ? true : false)
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
