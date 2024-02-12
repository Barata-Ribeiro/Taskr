import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { User } from "../entities/user/User"
import { InternalServerError, NotFoundError, UnauthorizedError } from "../middlewares/helpers/ApiErrors"
import { userRepository } from "../repositories/UserRepository"
import { teamRepository } from "./../repositories/TeamRepository"

export class TeamService {
    async createNewTeam(id: string, requestingDataBody: RequestingTeamDataBody): Promise<TeamResponseDTO> {
        const user = await userRepository.findOneBy({ id })
        if (!user) throw new NotFoundError("User not found.")

        const team = await teamRepository.create({
            name: requestingDataBody.name,
            description: requestingDataBody.description,
            founder: user,
            members: [user]
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

        if (requestingDataBody.name) team.name = requestingDataBody.name
        if (requestingDataBody.description) team.description = requestingDataBody.description
        if (requestingDataBody.userIds) {
            const memberPromises = requestingDataBody.userIds.map((memberId) =>
                userRepository.findOneBy({ id: memberId })
            )
            const resolvedMembersPromises = await Promise.all(memberPromises)

            team.members = resolvedMembersPromises.filter((member) => member !== null) as User[]
        }

        try {
            await teamRepository.save(team)
        } catch (error) {
            console.error("Error saving team:", error)
            throw new InternalServerError("An error occurred while updating the team.")
        }

        return TeamResponseDTO.fromEntity(team, true, false)
    }
}
