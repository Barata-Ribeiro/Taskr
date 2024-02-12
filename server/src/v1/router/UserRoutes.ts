import { Router } from "express"
import { UserController } from "../../controllers/UserController"
import authMiddleware from "../../middlewares/AuthMiddleware"
import { BadRequestError } from "../../middlewares/helpers/ApiErrors"

const routes = Router()
const userController = new UserController()

routes.post("/", (req, res, next) => userController.createNewUser(req, res).catch(next))

routes.get("/", (req, res, next) => {
    let { perPage, page } = req.query as { perPage: string; page: string }

    const queryWasProvided = perPage && page
    const queryIsString = typeof perPage === "string" && typeof page === "string"
    const perPageIsNumber = !isNaN(+perPage)
    const pageIsNumber = !isNaN(+page)

    if (queryWasProvided && queryIsString && (!perPageIsNumber || !pageIsNumber))
        throw new BadRequestError("The query parameters 'perPage' and 'page' must be numbers.")

    if (queryWasProvided && queryIsString && perPageIsNumber && pageIsNumber)
        userController.getUsersWithPagination({ perPage, page }, req, res).catch(next)
    else userController.getAllUsers(req, res).catch(next)
})

routes.get("/:userId", (req, res, next) => userController.getUserById(req, res).catch(next))

routes.put("/:userId", authMiddleware, (req, res, next) => userController.updateOwnAccount(req, res).catch(next))

routes.delete("/:userId", (req, res, next) => userController.deleteOwnAccount(req, res).catch(next))

export default routes
