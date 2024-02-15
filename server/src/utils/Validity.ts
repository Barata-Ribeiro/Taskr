import { validate } from "uuid"
import { TaskPriority } from "../entities/task/PriorityEnum"
import { TaskStatus } from "../entities/task/StatusEnum"

export const isEmailValid = (email: string): boolean => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

export const isPasswordStrong = (password: string): boolean => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return regex.test(password)
}

export const isUUIDValid = (uuid: string): boolean => {
    return validate(uuid)
}

export const isTaskStatus = (value: any): value is TaskStatus => {
    return Object.values(TaskStatus).includes(value)
}

export const isTaskPriority = (value: any): value is TaskPriority => {
    return Object.values(TaskPriority).includes(value)
}
