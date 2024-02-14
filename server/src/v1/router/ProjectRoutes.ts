import { Router } from "express"
import { ProjectController } from "../../controllers/ProjectController"
import authMiddleware from "../../middlewares/AuthMiddleware"

const routes = Router()
const projectController = new ProjectController()

routes.post("/", authMiddleware, (req, res, next) => projectController.createNewProject(req, res).catch(next))

routes.get("/:projectId", authMiddleware, (req, res, next) => {
    const withProjectMembers = req.query.withMembers === "true"
    projectController.getProjectById(withProjectMembers, req, res).catch(next)
})

routes.put("/:projectId", authMiddleware, (req, res, next) => projectController.updateProjectById(req, res).catch(next))

routes.delete("/:projectId", authMiddleware, (req, res, next) =>
    projectController.deleteProjectById(req, res).catch(next)
)
export default routes
