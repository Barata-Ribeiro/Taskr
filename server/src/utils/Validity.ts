import { validate } from "uuid"

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
