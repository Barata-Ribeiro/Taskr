import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
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
}
