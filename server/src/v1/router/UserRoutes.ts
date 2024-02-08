import { Router } from "express"

const routes = Router()
// TODO: Import the user controller
// TODO: Add authentication middleware

routes.post("/", (req, res, next) => {})

routes.get("/", (req, res, next) => {})

routes.get("/:userId", (req, res, next) => {})

routes.put("/:userId", (req, res, next) => {})

routes.delete("/:userId", (req, res, next) => {})

export default routes
