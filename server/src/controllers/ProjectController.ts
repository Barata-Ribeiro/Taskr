import { Request, Response } from "express"
import { validate } from "uuid"
import { BadRequestError } from "../middlewares/helpers/ApiErrors"
import { ProjectService } from "../services/ProjectService"

const projectService = new ProjectService()

export class ProjectController {
    async createNewProject(req: Request, res: Response) {
        const requestingDataBody = req.body as RequestingProjectDataBody
        if (!requestingDataBody) throw new BadRequestError("You cannot create a project without providing the details.")

        const requestingUser = req.user
        if (!requestingUser?.data?.id) throw new BadRequestError("You must be logged in to update your account.")
        if (!validate(requestingUser?.data.id)) throw new BadRequestError("Invalid user ID.")

        if (!requestingUser.is_in_team) throw new BadRequestError("You must be in a team to create a project.")

        const response = await projectService.createNewProject(requestingUser.data.id, requestingDataBody)

        return res.status(201).json({
            status: "success",
            message: "Project created successfully.",
            data: response
        })
    }

    async getProjectById(req: Request, res: Response) {}

    async updateProjectById(req: Request, res: Response) {}

    async deleteProjectById(req: Request, res: Response) {}
}
