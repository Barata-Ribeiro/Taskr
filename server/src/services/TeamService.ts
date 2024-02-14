import { validate } from "uuid"
import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { AppDataSource } from "../database/data-source"
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError
} from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { teamRepository } from "./../repositories/TeamRepository"

export class TeamService {
    async createNewTeam(id: string, requestingDataBody: RequestingTeamDataBody): Promise<TeamResponseDTO> {
        const user = await userRepository.findOneBy({ id })
        if (!user) throw new NotFoundError("User not found.")

        const userTeams = await teamRepository.findOneBy({ name: requestingDataBody.name })
        if (userTeams) throw new BadRequestError("A team with this name already exists.")

        const team = await teamRepository.create({
            name: requestingDataBody.name,
            description: requestingDataBody.description,
            founder: user,
            members: Promise.resolve([user])
        })

        try {
            await teamRepository.save(team)
        } catch (error) {
            console.error("Error saving team:", error)
            throw new InternalServerError("An error occurred while creating the team.")
        }

        return TeamResponseDTO.fromEntity(team)
    }

    async updateTeamById(
        teamId: string,
        requestingUserId: string,
        requestingDataBody: RequestingTeamEditDataBody
    ): Promise<TeamResponseDTO> {
        const team = await teamRepository.findOne({
            where: { id: teamId },
            relations: ["members"]
        })
        if (!team) throw new NotFoundError("Team not found.")

        if (team.founder.id !== requestingUserId) throw new UnauthorizedError("You are not allowed to edit this team.")

        if (requestingDataBody.name) {
            const teamWithSameName = await teamRepository.findOneBy({ name: requestingDataBody.name })
            if (teamWithSameName && teamWithSameName.id !== teamId)
                throw new BadRequestError("A team with this name already exists.")

            team.name = requestingDataBody.name
        }
        if (requestingDataBody.description) team.description = requestingDataBody.description
        if (requestingDataBody.userIds) {
            const invalidUserIds = requestingDataBody.userIds.filter((id) => !validate(id))
            if (invalidUserIds.length > 0)
                throw new BadRequestError(
                    `Invalid user IDs: ${invalidUserIds.join(", ")}. \n\n Please provide valid user IDs.`
                )

            let membersToAdd = []
            const currentMembers = await team.members
            for (const memberId of requestingDataBody.userIds) {
                const isAlreadyAMember = currentMembers.some((member) => member.id === memberId)
                if (isAlreadyAMember)
                    throw new BadRequestError(
                        `User with ID ${memberId} is already a member of the team. Make sure to select only members who are not already in the team.`
                    )

                const userToBeAdded = await userRepository.findOneBy({ id: memberId })
                if (!userToBeAdded) throw new NotFoundError(`User with ID ${memberId} not found.`)

                membersToAdd.push(userToBeAdded)
            }

            team.members = Promise.resolve([...currentMembers, ...membersToAdd])
        }

        try {
            await teamRepository.save(team)
        } catch (error) {
            console.error("Error saving team:", error)
            throw new InternalServerError("An error occurred while updating the team.")
        }

        return TeamResponseDTO.fromEntity(team, true, false)
    }

    async deleteTeamById(teamId: string, requestingUserId: string): Promise<void> {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const team = await teamRepository.findOneBy({ id: teamId })
                if (!team) throw new NotFoundError("Team not found.")

                if (team.founder.id !== requestingUserId)
                    throw new UnauthorizedError("You are not allowed to delete this team.")

                await transactionalEntityManager.remove(team)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
