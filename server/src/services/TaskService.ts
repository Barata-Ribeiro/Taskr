import { RequestingTaskDataBody } from "../interfaces/TaskInterface"
import { BadRequestError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { projectRepository } from "../repositories/ProjectRepository"
import { tagRepository } from "../repositories/TagRepository"
import { taskRepository } from "../repositories/TaskRepository"
import { userRepository } from "../repositories/UserRepository"
import { isTaskPriority, isTaskStatus } from "../utils/Validity"

export class TaskService {
    async createNewTask(userId: string, requestingDataBody: RequestingTaskDataBody) {
        if (!requestingDataBody.title) throw new BadRequestError("You must provide a title for the task.")
        if (!requestingDataBody.description) throw new BadRequestError("You must provide a description for the task.")
        if (!requestingDataBody.projectId)
            throw new BadRequestError("You must specify the project the task belongs to.")
        if (!requestingDataBody.dueDate) throw new BadRequestError("You must specify the due date for the task.")

        const requestingUser = await userRepository.findOneBy({ id: userId })
        if (!requestingUser) throw new NotFoundError("User not found.")

        const project = await projectRepository.findOne({
            where: { id: requestingDataBody.projectId },
            relations: ["members"]
        })
        if (!project) throw new NotFoundError("Project not found.")

        const resolvedMembers = await project.members
        const isUserInProject = resolvedMembers.some((member) => member.id === requestingUser.id)
        if (!isUserInProject)
            throw new BadRequestError("You cannot create a task in a project you are not a member of.")

        const newTask = await taskRepository.create({
            title: requestingDataBody.title,
            description: requestingDataBody.description,
            project: project,
            creator: requestingUser,
            status: isTaskStatus(requestingDataBody.status) ? requestingDataBody.status : undefined,
            priority: isTaskPriority(requestingDataBody.priority) ? requestingDataBody.priority : undefined,
            dueDate: new Date(requestingDataBody.dueDate)
        })

        if (requestingDataBody.tags) {
            const tags = await Promise.all(
                requestingDataBody.tags.map(async (tagName) => {
                    let tag = await tagRepository.findOneBy({ name: tagName })
                    if (!tag) {
                        tag = await tagRepository.create({ name: tagName })
                        await tagRepository.save(tag)
                    }
                    return tag
                })
            )

            newTask.tags = Promise.resolve(tags)
        }

        try {
            await taskRepository.save(newTask)
        } catch (error) {
            console.error("Error saving team:", error)
            throw new InternalServerError("An error occurred while creating the task.")
        }
    }
}
