const BACKEND_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// Auth
export const AUTH_REGISTER = () => `${BACKEND_URL}/api/v1/auth/register`
export const AUTH_LOGIN = () => `${BACKEND_URL}/api/v1/auth/login`
export const AUTH_REFRESH_TOKEN = () => `${BACKEND_URL}/api/v1/auth/refresh-token`
export const AUTH_LOGOUT = () => `${BACKEND_URL}/api/v1/auth/logout`

// User
export const USER_GET_CONTEXT = () => `${BACKEND_URL}/api/v1/users/me/context`
export const USER_GET_PUBLIC_PROFILE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/users/profile/${id}`
export const USER_GET_DASHBOARD = () => `${BACKEND_URL}/api/v1/users/me/dashboard`
export const USER_PATCH_UPDATE_ACCOUNT = (id: string, ra?: boolean) => {
    let url = `${BACKEND_URL}/api/v1/users/me/${id}`
    if (ra) url += `?ra=true`
    return url
}
export const USER_DELETE_ACCOUNT = (id: string) => `${BACKEND_URL}/api/v1/users/me/${id}`

// Notifications
export const NOTIFICATIONS_GET_ALL_PAGINATED = (page: number, perPage: number, direction: string, orderBy: string) => {
    return `${BACKEND_URL}/api/v1/notifications?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
}
export const NOTIFICATIONS_GET_LATEST = () => `${BACKEND_URL}/api/v1/notifications/latest`
export const NOTIFICATIONS_PATCH_MARK_AS_READ = (id: string) => `${BACKEND_URL}/api/v1/notifications/${id}/read`
export const NOTIFICATIONS_DELETE_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/notifications/${id}`

// Organizations
export const ORGANIZATIONS_GET_LIST = (
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/organizations?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}
export const ORGANIZATIONS_GET_BY_ID = (id: string) => `${BACKEND_URL}/api/v1/organizations/${id}`
export const ORGANIZATIONS_GET_MEMBERS_BY_ID = (
    id: string,
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/organizations/${id}/members?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}
export const ORGANIZATIONS_GET_PROJECTS_BY_ID = (
    id: string,
    page: number,
    perPage: number,
    search: string | null,
    direction: string,
    orderBy: string,
) => {
    let url = `${BACKEND_URL}/api/v1/organizations/${id}/projects?page=${page}&perPage=${perPage}&direction=${direction}&orderBy=${orderBy}`
    if (search) url += `&search=${search}`
    return url
}
export const ORGANIZATIONS_POST_NEW = () => `${BACKEND_URL}/api/v1/organizations`

// Projects
export const PROJECTS_POST_NEW = (orgId: string) => `${BACKEND_URL}/api/v1/projects/${orgId}/project-create`
export const PROJECTS_PATCH_UPDATE_PROJECT = (orgId: string, projectId: string) =>
    `${BACKEND_URL}/api/v1/projects/${orgId}/project/${projectId}`
export const PROJECTS_GET_BY_ORG_ID_AND_PROJECT_ID = (orgId: number, projectId: number) =>
    `${BACKEND_URL}/api/v1/projects/${orgId}/project/${projectId}`
export const PROJECTS_GET_OWN_PROJECTS_BY_ORG_ID = (orgId: number) => `${BACKEND_URL}/api/v1/projects/${orgId}/me`
export const PROJECTS_DELETE_PROJECT_BY_ORG_ID_AND_PROJECT_ID = (orgId: number, projectId: string) =>
    `${BACKEND_URL}/api/v1/projects/${orgId}/project/${projectId}`
export const PROJECTS_PATCH_UPDATE_PROJECT_STATUS = (orgId: number, projectId: string, status: string) =>
    `${BACKEND_URL}/api/v1/projects/${orgId}/project/${projectId}/status?option=${status}`

// Tasks
export const TASKS_POST_CREATE_NEW_TASK = (projectId: number) => `${BACKEND_URL}/api/v1/tasks/${projectId}/create-task`
export const TASKS_GET_ALL_BY_PROJECT_ID = (orgId: number, projectId: number) =>
    `${BACKEND_URL}/api/v1/projects/${orgId}/project/${projectId}/tasks`
export const TASKS_GET_BY_PROJECT_ID_AND_TASK_ID = (projectId: number, taskId: number) =>
    `${BACKEND_URL}/api/v1/tasks/${projectId}/task/${taskId}`
