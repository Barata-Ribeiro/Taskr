import { Router } from "express"
import { CommentController } from "../../controllers/CommentController"

const routes = Router({ mergeParams: true })
const commentController = new CommentController()

routes.get("/", (req, res, next) => commentController.createNewComment(req, res).catch(next))

routes.get("/:commentId", (req, res, next) => commentController.getCommentById(req, res).catch(next))

routes.put("/:commentId", (req, res, next) => commentController.updateCommentById(req, res).catch(next))

routes.delete("/:commentId", (req, res, next) => commentController.deleteCommentById(req, res).catch(next))

export default routes
