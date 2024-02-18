import { Router } from "express"
import { TaskController } from "../../controllers/TaskController"
import authMiddleware from "../../middlewares/AuthMiddleware"

// import commentRoutes from "./v1/router/CommentRoutes"

const routes = Router()
const taskController = new TaskController()

routes.post("/", authMiddleware, (req, res, next) => taskController.createNewTask(req, res).catch(next))

routes.get("/:projectId", authMiddleware, (req, res, next) => taskController.getAllTasks(req, res).catch(next))

routes.get("/:projectId/:taskId", authMiddleware, (req, res, next) => taskController.getTaskById(req, res).catch(next))

// routes.use("/:projectId/:taskId/comments", authMiddleware, commentRoutes)

routes.put("/:taskId", authMiddleware, (req, res, next) => taskController.updateTaskById(req, res).catch(next))

routes.delete("/:projectId/:taskId", authMiddleware, (req, res, next) =>
    taskController.deleteTaskById(req, res).catch(next)
)

export default routes
