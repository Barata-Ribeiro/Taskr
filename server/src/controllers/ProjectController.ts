import { Request, Response } from "express"
import { validate } from "uuid"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { ProjectService } from "../services/ProjectService"

export class ProjectController {
    private projectService: ProjectService

    constructor() {
        this.projectService = new ProjectService()
    }

    async createNewProject(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingProjectDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot create a project without providing the details.")

        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        if (!requestingUser.is_in_team) throw new BadRequestError("You must be in a team to create a project.")

        const response = await this.projectService.createNewProject(requestingUser.data.id, requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Project created successfully.",
            data: response
        })
    }

    async getProjectById(withProjectMembers: boolean, req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("Project Id is required.")
        if (!validate(projectId)) throw new BadRequestError("Invalid project ID.")

        const response = await this.projectService.getProjectById(withProjectMembers, projectId, requestingUser.data.id)

        return res.status(200).json({
            status: "success",
            message: "Project retrieved successfully.",
            data: {
                ...response,
                total_members: response.members?.length || undefined
            }
        })
    }

    async updateProjectById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("Project Id is required.")
        if (!validate(projectId)) throw new BadRequestError("Invalid project ID.")

        const requestingDataBody = req.body as RequestingProjectEditDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot update a project without providing the details.")

        const response = await this.projectService.updateProjectById(
            requestingUser.data.id,
            projectId,
            requestingDataBody
        )

        return res.status(200).json({
            status: "success",
            message: "Project updated successfully.",
            data: response
        })
    }

    async deleteProjectById(req: Request, res: Response) {
        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        const { projectId } = req.params
        if (!projectId) throw new BadRequestError("Project Id is required.")
        if (!validate(projectId)) throw new BadRequestError("Invalid project ID.")

        await this.projectService.deleteProjectById(requestingUser.data.id, projectId)

        return res.status(200).json({
            status: "success",
            message: "Project deleted successfully."
        })
    }
}
