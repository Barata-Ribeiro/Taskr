import { Request, Response } from "express"
import { validate } from "uuid"
import { ProjectResponseDTO } from "../DTOs/project/ProjectResponseDTO"
import { TeamResponseDTO } from "../DTOs/team/TeamResponseDTO"
import { UserResponseDTO } from "../DTOs/user/UserResponseDTO"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { teamRepository } from "../repositories/TeamRepository"
import { TeamService } from "../services/TeamService"

const teamService = new TeamService()

export class TeamController {
    async createNewTeam(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingTeamDataBody
        if (!requestingDataBody) throw new BadRequestError("You must provide the team name and description.")

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

        let teamsData = await Promise.all(teams.map((team) => TeamResponseDTO.fromEntity(team)))

        return res.status(200).json({
            status: "success",
            message: "Teams list retrieved successfully.",
            data: [...teamsData],
            total
        })
    }

    async getTeamById({ withMembers, withProjects }: TeamQueryRequest, req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const { teamId } = req.params
        if (!teamId) throw new BadRequestError("Team Id is required.")
        if (!validate(teamId)) throw new BadRequestError("Invalid team ID.")

        let team

        if (withMembers && !withProjects)
            team = await teamRepository.findOne({
                where: { id: teamId },
                relations: ["founder", "members"]
            })
        else if (withProjects && !withMembers)
            team = await teamRepository.findOne({
                where: { id: teamId },
                relations: ["founder", "projects"]
            })
        else if (withMembers && withProjects)
            team = await teamRepository.findOne({
                where: { id: teamId },
                relations: ["founder", "members", "projects"]
            })
        else team = await teamRepository.findOne({ where: { id: teamId }, relations: ["founder"] })

        if (!team) throw new BadRequestError("Team not found.")

        return res.status(200).json({
            status: "success",
            message: "Team retrieved successfully.",
            data: await TeamResponseDTO.fromEntity(team, withMembers, withProjects)
        })
    }

    async getTeamMembers(req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const { teamId } = req.params
        if (!teamId) throw new BadRequestError("Team Id is required.")
        if (!validate(teamId)) throw new BadRequestError("Invalid team ID.")

        const team = await teamRepository.findOne({
            where: { id: teamId },
            relations: ["members"]
        })
        if (!team) throw new BadRequestError("Team not found.")

        const teamMembers = await team.members
        const teamMembersDTOs = await Promise.all(teamMembers.map((member) => UserResponseDTO.fromEntity(member)))
        const isMember = teamMembersDTOs.some((member) => member.id === requestingUser.id)
        if (!isMember) throw new BadRequestError("You are not a member of this team.")

        const response = teamMembersDTOs.length > 0 ? [...teamMembersDTOs] : []
        const responseMessage =
            teamMembersDTOs.length > 0
                ? `Members of team ${team.name} retrieved successfully.`
                : `No members found for team ${team.name}.`

        return res.status(200).json({
            status: "success",
            message: responseMessage,
            data: response,
            total_members: teamMembersDTOs.length
        })
    }

    async getTeamProjects(req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const { teamId } = req.params
        if (!teamId) throw new BadRequestError("Team Id is required.")
        if (!validate(teamId)) throw new BadRequestError("Invalid team ID.")

        const team = await teamRepository.findOne({
            where: { id: teamId },
            relations: ["projects"]
        })
        if (!team) throw new BadRequestError("Team not found.")

        const projects = await team.projects
        const projectDTOs = await Promise.all(projects.map((project) => ProjectResponseDTO.fromEntity(project)))

        const response = projectDTOs.length > 0 ? [...projectDTOs] : []

        const responseMessage =
            projectDTOs.length > 0
                ? `Projects of team ${team.name} retrieved successfully.`
                : `No projects found for team ${team.name}.`

        return res.status(200).json({
            status: "success",
            message: responseMessage,
            data: response,
            total_projects: projectDTOs.length
        })
    }

    async updateTeamById(req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const { teamId } = req.params
        if (!teamId) throw new BadRequestError("Team Id is required.")
        if (!validate(teamId)) throw new BadRequestError("Invalid team ID.")

        const requestingDataBody = req.body as RequestingTeamEditDataBody
        if (!requestingDataBody)
            throw new BadRequestError("You cannot update your team without providing at least one field to update.")

        const response = await teamService.updateTeamById(teamId, requestingUser?.id, requestingDataBody)

        return res.status(200).json({
            status: "success",
            message: "Team updated successfully.",
            data: response
        })
    }

    async deleteTeamById(req: Request, res: Response) {
        const requestingUser = req.user.data
        if (!requestingUser?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.id)) throw new BadRequestError("Invalid user ID.")

        const { teamId } = req.params
        if (!teamId) throw new BadRequestError("Team Id is required.")
        if (!validate(teamId)) throw new BadRequestError("Invalid team ID.")

        await teamService.deleteTeamById(teamId, requestingUser?.id)

        return res.status(200).json({
            status: "success",
            message: "Team deleted successfully."
        })
    }
}
