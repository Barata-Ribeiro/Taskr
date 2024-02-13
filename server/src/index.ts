// Dependency Imports
import bodyParser from "body-parser"
import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import errorHandler from "errorhandler"
import express from "express"
import session from "express-session"
import helmet from "helmet"
import methodOverride from "method-override"
import logger from "morgan"
import path from "path"
import favicon from "serve-favicon"

// Route Imports
import authRoutes from "./v1/router/AuthRoutes"
import taskRoutes from "./v1/router/TaskRoutes"
import teamRoutes from "./v1/router/TeamRoutes"
import usersRoutes from "./v1/router/UserRoutes"

// Database Import
import { AppDataSource } from "./database/data-source"

// Middleware Imports
import errorMiddleware from "./middlewares/ErrorMiddleware"
import SetCacheControl from "./middlewares/SetCacheControl"

// Database Type Check
if (AppDataSource.options.type !== "postgres") throw new Error("Invalid Database Type: Only 'postgres' is supported.")

const startServer = async () => {
    try {
        // Database Initialization
        await AppDataSource.initialize()

        // Express App Initialization
        let app = express()
        const PORT = process.env.PORT || 3000
        let ENV = process.env.NODE_ENV || "development"

        // Express App Middlewares
        app.set("port", PORT)
        app.set("trust proxy", 1)
        const corsOptions: cors.CorsOptions = {
            origin: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: ["Accept", "Authorization", "Content-Type", "X-Refresh-Token"],
            credentials: true
        }
        app.use(cors(corsOptions))
        app.use(favicon(path.join(__dirname, "..", "public", "favicon.ico")))
        app.use(logger("dev"))
        app.use(methodOverride())
        app.use(
            session({
                name: "session_id",
                resave: true,
                saveUninitialized: true,
                secret: process.env.SESSION_SECRET_KEY || "session_secret_test_key",
                cookie: {
                    secure: true,
                    httpOnly: true,
                    domain: process.env.SESSION_DOMAIN || "http://localhost:3000",
                    path: process.env.SESSION_PATH || "/",
                    expires: new Date(Date.now() + 60 * 60 * 1000)
                }
            })
        )
        app.use(cookieParser())
        app.use(helmet({ crossOriginResourcePolicy: false }))
        app.use(helmet.noSniff())
        app.use(helmet.xssFilter())
        app.use(helmet.ieNoOpen())
        app.disable("x-powered-by")
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(SetCacheControl)
        app.use(compression({ level: 6, threshold: 100 * 1000 }))
        app.use(express.static(path.join(__dirname, "public")))

        // Routes
        app.use("/api/v1/auth", authRoutes)
        app.use("/api/v1/users", usersRoutes)
        app.use("/api/v1/teams", teamRoutes)
        app.use("/api/v1/tasks/", taskRoutes)

        app.use(errorMiddleware)

        if (app.get("env") === "development") app.use(errorHandler())

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}, enjoy!`)
            if (ENV === "production") console.log("Server is running in production mode.")
            else console.log(`Server in running in ${ENV} mode.`)
        })
    } catch (error) {
        console.error("Error while starting the server:", error)
    }
}

startServer().catch((err) => console.error("Failed to start the server:", err))
