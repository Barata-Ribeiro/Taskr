import { Router } from "express"
import { TeamController } from "../../controllers/TeamController"
import authMiddleware from "../../middlewares/AuthMiddleware"

const routes = Router()
const teamController = new TeamController()

routes.post("/", authMiddleware, (req, res, next) => teamController.createNewTeam(req, res).catch(next))

routes.get("/", authMiddleware, (req, res, next) => teamController.getAllTeams(req, res).catch(next))

routes.get("/:teamId", authMiddleware, (req, res, next) => {
    const withMembers = req.query.withMembers === "true"
    const withProjects = req.query.withProjects === "true"

    teamController.getTeamById({ withMembers, withProjects }, req, res).catch(next)
})

routes.get("/:teamId/members", authMiddleware, (req, res, next) => teamController.getTeamMembers(req, res).catch(next))

routes.get("/:teamId/projects", authMiddleware, (req, res, next) =>
    teamController.getTeamProjects(req, res).catch(next)
)

routes.put("/:teamId", authMiddleware, (req, res, next) => teamController.updateTeamById(req, res).catch(next))

routes.delete("/:teamId", authMiddleware, (req, res, next) => teamController.deleteTeamById(req, res).catch(next))

export default routes
