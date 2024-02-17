import console from "console"
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
import { checkIfBodyExists } from "../utils/Checker"
import { saveEntityToDatabase } from "../utils/Operations"
import { teamRepository } from "./../repositories/TeamRepository"

export class TeamService {
    async createNewTeam(id: string, requestingDataBody: RequestingTeamDataBody): Promise<TeamResponseDTO> {
        checkIfBodyExists(requestingDataBody, ["name", "description"])

        const user = await userRepository.findOne({
            where: { id },
            relations: ["teams"]
        })
        if (!user) throw new NotFoundError("User not found.")

        const userTeams = await teamRepository.findOneBy({ name: requestingDataBody.name })
        if (userTeams) throw new BadRequestError("A team with this name already exists.")

        const team = teamRepository.create({
            name: requestingDataBody.name,
            description: requestingDataBody.description,
            founder: user
        })

        team.members = Promise.resolve([user])

        const savedNewTeam = await saveEntityToDatabase(teamRepository, team)

        return TeamResponseDTO.fromEntity(savedNewTeam)
    }

    async updateTeamById(
        teamId: string,
        requestingUserId: string,
        requestingDataBody: RequestingTeamEditDataBody
    ): Promise<TeamResponseDTO> {
        const wereUsersAdded = requestingDataBody.userIds && requestingDataBody.userIds.length > 0

        const team = await teamRepository.findOne({
            where: { id: teamId },
            relations: ["founder", wereUsersAdded ? "members" : ""]
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

            team.members = Promise.resolve([...(await currentMembers), ...membersToAdd])
        }

        const savedEditedTeam = await saveEntityToDatabase(teamRepository, team)

        return TeamResponseDTO.fromEntity(savedEditedTeam, wereUsersAdded ? true : false, false)
    }

    async deleteTeamById(teamId: string, requestingUserId: string): Promise<void> {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const team = await teamRepository.findOne({
                    where: { id: teamId },
                    relations: ["founder"]
                })

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
