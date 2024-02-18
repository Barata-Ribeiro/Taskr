import { TaskResponseDTO } from "../DTOs/task/TaskResponseDTO"
import { TaskStatus } from "../entities/task/StatusEnum"
import { RequestingTaskDataBody } from "../interfaces/TaskInterface"
import { BadRequestError, NotFoundError } from "../middlewares/helpers/ApiErrors"
import { projectRepository } from "../repositories/ProjectRepository"
import { tagRepository } from "../repositories/TagRepository"
import { taskRepository } from "../repositories/TaskRepository"
import { userRepository } from "../repositories/UserRepository"
import { checkIfBodyExists } from "../utils/Checker"
import { saveEntityToDatabase } from "../utils/Operations"
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

        const savedTask = await saveEntityToDatabase(taskRepository, newTask)

        return TaskResponseDTO.fromEntity(savedTask, false)
    }

    async getAllTasks(userId: string, projectId: string) {
        const isUserInProject =
            (await projectRepository
                .createQueryBuilder("project")
                .innerJoin("project.members", "member", "member.id = :userId", { userId })
                .where("project.id = :projectId", { projectId })
                .getCount()) > 0

        if (!isUserInProject) throw new BadRequestError("You cannot get tasks from a project you are not a member of.")

        const tasks = await taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.tags", "tag")
            .leftJoinAndSelect("task.assignees", "assignee")
            .orderBy("task.createdAt", "DESC")
            .orderBy("tag.name", "ASC")
            .where("task.project.id = :projectId", { projectId })
            .getMany()

        const tasksToDTO = await Promise.all(tasks.map(async (task) => TaskResponseDTO.fromEntity(task, false)))

        const tasksObject = {
            tasks_count: tasksToDTO.length,
            tasks_planned: tasksToDTO.filter((task) => task.status === TaskStatus.PLANNED),
            tasks_in_progress: tasksToDTO.filter((task) => task.status === TaskStatus.IN_PROGRESS),
            tasks_testing: tasksToDTO.filter((task) => task.status === TaskStatus.TESTING),
            tasks_done: tasksToDTO.filter((task) => task.status === TaskStatus.DONE)
        }

        return tasksObject
    }

    async getTaskById(userId: string, projectId: string, taskId: string) {
        const isUserInProject =
            (await projectRepository
                .createQueryBuilder("project")
                .innerJoin("project.members", "member", "member.id = :userId", { userId })
                .where("project.id = :projectId", { projectId })
                .getCount()) > 0
        if (!isUserInProject) throw new BadRequestError("You cannot get a task from a project you are not a member of.")

        const task = await taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.comments", "comment")
            .leftJoinAndSelect("task.tags", "tag")
            .leftJoinAndSelect("task.assignees", "assignee")
            .orderBy("comment.createdAt", "DESC")
            .orderBy("tag.name", "ASC")
            .where("task.project.id = :projectId", { projectId })
            .andWhere("task.id = :taskId", { taskId })
            .getOne()
        if (!task) throw new NotFoundError("Task not found.")

        const taskToDTO = await TaskResponseDTO.fromEntity(task, true)

        const taskObject = {
            task: taskToDTO,
            assignees_count: taskToDTO?.assignees?.length,
            comments_count: taskToDTO?.comments?.length,
            tags_count: taskToDTO?.tags?.length
        }

        return taskObject
    }
}
