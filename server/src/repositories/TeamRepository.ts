import { AppDataSource } from "../database/data-source"
import { Team } from "../entities/team/Team"

export const teamRepository = AppDataSource.getRepository(Team)
