import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from "typeorm-extension"
import path = require("path")

const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: "mongodb",
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
    synchronize: true,
    logging: true,
    migrationsRun: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    entities: [
        path.join(__dirname, "..", "entities", "**", "*.{ts,js}"),
        path.join(__dirname, "..", "entities", "*.{ts,js}")
    ],
    migrations: [path.join(__dirname, "..", "database", "migrations", "*.{ts,js}")],
    subscribers: [path.join(__dirname, "..", "database", "subscribers", "*.{ts,js}")]
}

export const AppDataSource = new DataSource(dataSourceOptions)
