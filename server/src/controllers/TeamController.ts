import { Request, Response } from "express"
import { validate } from "uuid"
import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { teamRepository } from "../repositories/TeamRepository"
import { TeamService } from "../services/TeamService"

const teamService = new TeamService()

export class TeamController {
    async createNewTeam(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingTeamDataBody

        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        if (requestingUser.is_in_team) throw new BadRequestError("You are already in a team.")

        const response = await teamService.createNewTeam(requestingUser?.data.id, requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Team created successfully.",
            data: response
        })
    }

    async getAllTeams(req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const [teams, total] = await teamRepository.findAndCount({
            relations: ["founder"]
        })

        let teamsData = teams.map((team) => TeamResponseDTO.fromEntity(team))

        return res.status(200).json({
            status: "success",
            message: "Teams list retrieved successfully.",
            data: [...teamsData],
            total
        })
    }

    async getTeamById(req: Request, res: Response) {
        // ...
    }
    async updateTeamById(req: Request, res: Response) {
        // ...
    }
    async deleteTeamById(req: Request, res: Response) {
        // ...
    }
}
