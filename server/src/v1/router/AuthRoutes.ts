import { Router } from "express"
import { AuthController } from "../../controllers/AuthController"
import authMiddleware from "../../middlewares/AuthMiddleware"

const routes = Router()
const authController = new AuthController()

routes.post("/login", (req, res, next) => {
    authController.login(req, res).catch(next)
})
routes.get("/refresh-token", (req, res, next) => {
    authController.refreshToken(req, res).catch(next)
})
routes.get("/logout", authMiddleware, (req, res, next) => {
    authController.logout(req, res).catch(next)
})

export default routes
