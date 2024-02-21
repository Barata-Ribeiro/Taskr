import console from "console"
import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { AppDataSource } from "../database/data-source"
import { ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
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

        const checkIfTeamExistsByName = await teamRepository.existsBy({ name: requestingDataBody.name })
        if (checkIfTeamExistsByName) throw new ConflictError("A team with this name already exists.")

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
        const wereUsersAdded = requestingDataBody.usersUsername && requestingDataBody.usersUsername.length > 0

        const team = await teamRepository.findOne({
            where: { id: teamId },
            relations: ["founder", wereUsersAdded ? "members" : ""]
        })
        if (!team) throw new NotFoundError("Team not found.")

        if (team.founder.id !== requestingUserId) throw new UnauthorizedError("You are not allowed to edit this team.")

        if (requestingDataBody.name) {
            const checkIfTeamExistsByName = await teamRepository.existsBy({ name: requestingDataBody.name })
            if (checkIfTeamExistsByName) throw new ConflictError("A team with this name already exists.")

            team.name = requestingDataBody.name
        }
        if (requestingDataBody.description) team.description = requestingDataBody.description
        if (wereUsersAdded) {
            const currentMembers = (await team.members) || []

            const membersToAdd = await Promise.all(
                requestingDataBody.usersUsername!.map(async (username) => {
                    const user = await userRepository.findOneBy({ username })
                    if (!user) throw new NotFoundError(`User with username ${username} not found.`)

                    if (currentMembers.some((member) => member.id === user.id))
                        throw new ConflictError(`User with username ${username} is already in the team.`)

                    return user
                })
            )

            team.members = Promise.resolve([...currentMembers, ...membersToAdd])
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
