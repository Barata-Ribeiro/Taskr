import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from "typeorm-extension"
import path = require("path")

const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: "postgres",
    url: process.env.POSTGRES_URI || "postgres://postgres:xxxxxxxx@xxxxxxxxx:5432/test",
    database: process.env.POSTGRES_DB || "test",
    synchronize: true,
    logging: true,
    migrationsRun: true,
    ssl: true,
    entities: [
        path.join(__dirname, "..", "entities", "**", "*.{ts,js}"),
        path.join(__dirname, "..", "entities", "*.{ts,js}")
    ],
    migrations: [path.join(__dirname, "..", "database", "migrations", "*.{ts,js}")],
    subscribers: [path.join(__dirname, "..", "database", "subscribers", "*.{ts,js}")]
}

export const AppDataSource = new DataSource(dataSourceOptions)
