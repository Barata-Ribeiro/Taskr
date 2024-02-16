import { TaskResponseDTO } from "../DTOs/task/TaskResponseDTO"
import { RequestingTaskDataBody } from "../interfaces/TaskInterface"
import { BadRequestError, InternalServerError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { projectRepository } from "../repositories/ProjectRepository"
import { tagRepository } from "../repositories/TagRepository"
import { taskRepository } from "../repositories/TaskRepository"
import { userRepository } from "../repositories/UserRepository"
import { checkIfBodyExists } from "../utils/Checker"
import { isTaskPriority, isTaskStatus } from "../utils/Validity"

export class TaskService {
    async createNewTask(userId: string, requestingDataBody: RequestingTaskDataBody) {
        checkIfBodyExists(requestingDataBody, ["title", "description", "projectId", "dueDate"])

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

    async getAllTasks(userId: string, projectId: string) {
        const requestingUser = await userRepository.findOneBy({ id: userId })
        if (!requestingUser) throw new NotFoundError("User not found.")

        const project = await projectRepository.findOne({
            where: { id: projectId },
            relations: ["members", "tasks"]
        })
        if (!project) throw new NotFoundError("Project not found.")

        const resolvedMembers = await project.members
        const isUserInProject = resolvedMembers.some((member) => member.id === requestingUser.id)
        if (!isUserInProject) throw new BadRequestError("You cannot get tasks from a project you are not a member of.")

        const tasks = await project.tasks
        const tasksToDTO = await Promise.all(tasks.map(async (task) => TaskResponseDTO.fromEntity(task, false)))

        const tasksObject = {
            tasks_count: tasks.length,
            tasks_planned: tasksToDTO.filter((task) => task.status === "PLANNED"),
            tasks_in_progress: tasksToDTO.filter((task) => task.status === "IN_PROGRESS"),
            tasks_testing: tasksToDTO.filter((task) => task.status === "TESTING"),
            tasks_done: tasksToDTO.filter((task) => task.status === "DONE")
        }

        return tasksObject
    }
}
