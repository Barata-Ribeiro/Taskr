import { Router } from "express"
import { UserController } from "../../controllers/UserController"

const routes = Router()
const userController = new UserController()

routes.post("/", (req, res, next) => {
    userController.createNewUser(req, res).catch(next)
})

routes.get("/", (req, res, next) => {})

routes.get("/:userId", (req, res, next) => {})

routes.put("/:userId", (req, res, next) => {})

routes.delete("/:userId", (req, res, next) => {})

export default routes
