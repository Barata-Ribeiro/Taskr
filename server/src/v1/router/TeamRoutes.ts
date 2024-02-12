import { Router } from "express"
import { TeamController } from "../../controllers/teamController"
import authMiddleware from "../../middlewares/AuthMiddleware"

const routes = Router()
const teamController = new TeamController()

routes.post("/", authMiddleware, (req, res, next) => teamController.createNewTeam(req, res).catch(next))

routes.get("/", authMiddleware, (req, res, next) => teamController.getAllTeams(req, res).catch(next))

routes.get("/:teamId", authMiddleware, (req, res, next) => teamController.getTeamById(req, res).catch(next))

routes.put("/:teamId", authMiddleware, (req, res, next) => teamController.updateTeamById(req, res).catch(next))

routes.delete("/:teamId", authMiddleware, (req, res, next) => teamController.deleteTeamById(req, res).catch(next))

export default routes
