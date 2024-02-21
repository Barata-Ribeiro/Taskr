import { validate } from "uuid"
import { TaskResponseDTO } from "../DTOs/task/TaskResponseDTO"
import { AppDataSource } from "../database/data-source"
import { Project } from "../entities/project/Project"
import { TaskPriority } from "../entities/task/PriorityEnum"
import { TaskStatus } from "../entities/task/StatusEnum"
import { Tag } from "../entities/task/Tag"
import { Task } from "../entities/task/Task"
import { User } from "../entities/user/User"
import { RequestingTaskDataBody, RequestingTaskEditDataBody } from "../interfaces/TaskInterface"
import {
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
    UnprocessableContentError
} from "../middlewares/helpers/ApiErrors"
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
        const { projectId } = requestingDataBody
        if (!validate(projectId)) throw new BadRequestError("Invalid project ID.")

        return AppDataSource.transaction(async (transactionalEntityManager) => {
            const isUserInProject =
                (await projectRepository
                    .createQueryBuilder("project")
                    .innerJoin("project.members", "member", "member.id = :userId", { userId })
                    .where("project.id = :projectId", { projectId })
                    .getCount()) > 0

            if (!isUserInProject)
                throw new BadRequestError("You cannot get tasks from a project you are not a member of.")

            const newTask = new Task()
            newTask.title = requestingDataBody.title
            newTask.description = requestingDataBody.description
            newTask.project = { id: projectId } as Project
            newTask.creator = { id: userId } as User
            newTask.status = isTaskStatus(requestingDataBody.status) ? requestingDataBody.status : TaskStatus.PLANNED
            newTask.priority = isTaskPriority(requestingDataBody.priority)
                ? requestingDataBody.priority
                : TaskPriority.LOW
            newTask.dueDate = new Date(requestingDataBody.dueDate)

            if (requestingDataBody.tags) {
                const tags = await Promise.all(
                    requestingDataBody.tags.map(async (tagName) => {
                        let tag = await transactionalEntityManager.findOne(Tag, { where: { name: tagName } })
                        if (!tag) {
                            tag = transactionalEntityManager.create(Tag, { name: tagName })
                            await transactionalEntityManager.save(Tag, tag)
                        }
                        return tag
                    })
                )
                newTask.tags = Promise.resolve(tags)
            }

            await transactionalEntityManager.save(Task, newTask)

            return TaskResponseDTO.fromEntity(newTask, false)
        })
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
            .leftJoinAndSelect("task.creator", "creator")
            .leftJoinAndSelect("task.project", "project")
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
            .leftJoinAndSelect("task.creator", "creator")
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("task.comments", "comment")
            .leftJoinAndSelect("task.tags", "tag")
            .leftJoinAndSelect("task.assignees", "assignee")
            .where("task.id = :taskId", { taskId })
            .andWhere("task.project.id = :projectId", { projectId })
            .orderBy("comment.createdAt", "DESC")
            .addOrderBy("tag.name", "ASC")
            .getOne()
        if (!task) throw new NotFoundError("Task not found.")

        const taskToDTO = await TaskResponseDTO.fromEntity(task, true)

        if (!taskToDTO) throw new NotFoundError("Task not found.")

        const taskObject = {
            task: taskToDTO,
            assignees_count: taskToDTO.assignees?.length || 0,
            comments_count: taskToDTO.comments?.length || 0,
            tags_count: taskToDTO.tags?.length || 0
        }

        return taskObject
    }

    async updateTaskById(
        userId: string,
        projectId: string,
        taskId: string,
        requestingDataBody: RequestingTaskEditDataBody
    ) {
        const isUserInProject =
            (await projectRepository
                .createQueryBuilder("project")
                .innerJoin("project.members", "member", "member.id = :userId", { userId })
                .where("project.id = :projectId", { projectId })
                .getCount()) > 0

        if (!isUserInProject)
            throw new BadRequestError("You cannot update a task in a project you are not a member of.")

        const taskToEdit = await taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.creator", "creator")
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("task.tags", "tag")
            .leftJoinAndSelect("task.assignees", "assignee")
            .where("task.id = :taskId", { taskId })
            .andWhere("task.project.id = :projectId", { projectId })
            .getOne()
        if (!taskToEdit) throw new NotFoundError("Task not found in the requested project.")

        if (requestingDataBody.title) taskToEdit.title = requestingDataBody.title
        if (requestingDataBody.description) taskToEdit.description = requestingDataBody.description
        if (requestingDataBody.status && isTaskStatus(requestingDataBody.status))
            taskToEdit.status = requestingDataBody.status
        if (requestingDataBody.priority && isTaskPriority(requestingDataBody.priority))
            taskToEdit.priority = requestingDataBody.priority
        if (requestingDataBody.dueDate) taskToEdit.dueDate = new Date(requestingDataBody.dueDate)

        if (requestingDataBody.tags && requestingDataBody.tags.length > 0) {
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

            taskToEdit.tags = Promise.resolve(tags)
        }
        if (requestingDataBody.assignees && requestingDataBody.assignees.length > 0) {
            const currentAssignees = (await taskToEdit.assignees) || []

            if (currentAssignees.length + requestingDataBody.assignees.length > 2)
                throw new UnprocessableContentError("You cannot assign more than 2 users to a task.")

            const assignees = await Promise.all(
                requestingDataBody.assignees.map(async (assigneeUsername) => {
                    const assignee = await userRepository.findOneBy({ username: assigneeUsername })
                    if (!assignee) throw new NotFoundError("User of username " + assigneeUsername + " not found.")
                    if (currentAssignees.some((a) => a.username === assigneeUsername))
                        throw new ConflictError(assigneeUsername + " is already assigned to this task.")

                    return assignee
                })
            )

            taskToEdit.assignees = Promise.resolve([...currentAssignees, ...assignees])
        }

        const savedTask = await saveEntityToDatabase(taskRepository, taskToEdit)

        return TaskResponseDTO.fromEntity(savedTask, false)
    }

    async deleteTaskById(userId: string, projectId: string, taskId: string) {
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            try {
                const userIsOwnerOfTask =
                    (await taskRepository
                        .createQueryBuilder("task")
                        .innerJoin("task.creator", "creator", "creator.id = :userId", { userId })
                        .where("task.id = :taskId", { taskId })
                        .andWhere("task.project.id = :projectId", { projectId })
                        .getCount()) > 0
                if (!userIsOwnerOfTask) throw new UnauthorizedError("You cannot delete a task you did not create.")

                const requiredTask = await taskRepository
                    .createQueryBuilder("task")
                    .innerJoin("task.creator", "creator", "creator.id = :userId", { userId })
                    .where("task.id = :taskId", { taskId })
                    .andWhere("task.project.id = :projectId", { projectId })
                    .getOne()
                if (!requiredTask) throw new NotFoundError("Task not found in the requested project.")

                await transactionalEntityManager.remove(requiredTask)
            } catch (error) {
                console.error("Transaction failed:", error)
                throw new InternalServerError("An error occurred during the deletion process.")
            }
        })
    }
}
