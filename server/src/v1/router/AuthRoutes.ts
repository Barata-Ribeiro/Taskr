import { Router } from "express"
import { AuthController } from "../../controllers/AuthController"

const routes = Router()
const authController = new AuthController()

routes.post("/login", (req, res, next) => {
    authController.login(req, res).catch(next)
})
routes.post("/refresh-token", (req, res, next) => {
    authController.refreshToken(req, res).catch(next)
})
routes.get("/logout", (req, res, next) => {
    authController.logout(req, res).catch(next)
})

export default routes
