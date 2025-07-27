// backend-routes.ts
import { QueryParams } from "@/@types/application"
import env from "@/helpers/env"

// =================================================================
// =======================  Global Constant  =======================
// =================================================================
const BACKEND_URL = env.BACKEND_ORIGIN ?? "http://localhost:8080"
const API_URL = BACKEND_URL + "/api/v1"

// ================================================================
// ====================  Query Params Builder  ====================
// ================================================================
function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
    const queryParams: string[] = []

    for (const key in params) {
        const value = params[key]
        if (value !== undefined) queryParams.push(`${key}=${value}`)
    }

    return queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
}

// ===============================================================
// ===================  Auth Module Functions  ===================
// ===============================================================
export function registerAuthUrl(): string {
    return `${API_URL}/auth/register`
}

export function loginAuthUrl(): string {
    return `${API_URL}/auth/login`
}

export function refreshTokenAuthUrl(): string {
    return `${API_URL}/auth/refresh-token`
}

export function logoutAuthUrl(): string {
    return `${API_URL}/auth/logout`
}

// ===============================================================
// ===================  User Module Functions  ===================
// ===============================================================
export function userAccountUrl(): string {
    return `${API_URL}/users/me`
}

export function userMembershipsUrl(projectId: number | string): string {
    return `${API_URL}/users/${projectId}/memberships`
}

export function updateUserAccountUrl(): string {
    return `${API_URL}/users/me`
}

export function deleteUserAccountUrl(): string {
    return `${API_URL}/users/me`
}

// ===============================================================
// ================  Notification Module Functions  ==============
// ===============================================================
export function latestNotificationUrl(): string {
    return `${API_URL}/notifications/latest`
}

export function allNotificationsUrl(queryParams: QueryParams): string {
    const queryString = buildQueryParams({ ...queryParams })
    return `${API_URL}/notifications${queryString}`
}

export function changeNotificationStatusUrl(notifId: number | string, isRead: boolean): string {
    return `${API_URL}/notifications/${notifId}/status?isRead=${isRead}`
}

export function changeNotificationsStatusInBulkUrl(isRead: boolean): string {
    return `${API_URL}/notifications/status?isRead=${isRead}`
}

export function deleteNotificationUrl(notifId: number | string): string {
    return `${API_URL}/notifications/${notifId}`
}

export function deleteNotificationsInBulkUrl(notifIds: (number | string)[]): string {
    const queryString = notifIds.map(id => `notifIds=${id}`).join("&")
    return `${API_URL}/notifications?${queryString}`
}

// ===============================================================
// =================  Project Module Functions  ==================
// ===============================================================
export function myProjectsUrl(queryParams: QueryParams): string {
    const queryString = buildQueryParams({ ...queryParams })
    return `${API_URL}/projects/my${queryString}`
}

export function projectByIdUrl(projectId: number | string): string {
    return `${API_URL}/projects/${projectId}`
}

export function projectActivitiesUrl(projectId: number | string, queryParams: QueryParams): string {
    const queryString = buildQueryParams({ ...queryParams })
    return `${API_URL}/projects/${projectId}/activities${queryString}`
}

export function createProjectUrl(): string {
    return `${API_URL}/projects/create`
}

export function updateProjectUrl(projectId: number | string): string {
    return `${API_URL}/projects/${projectId}`
}

export function deleteProjectUrl(projectId: number | string): string {
    return `${API_URL}/projects/${projectId}`
}

// ===============================================================
// ==================  Tasks Module Functions  ===================
// ===============================================================
export function tasksByProjectUrl(projectId: number | string): string {
    return `${API_URL}/tasks/project/${projectId}`
}

export function latestTasksByProjectUrl(projectId: number | string): string {
    return `${API_URL}/tasks/project/${projectId}/latest`
}

export function createTaskUrl(): string {
    return `${API_URL}/tasks`
}

export function taskByIdUrl(taskId: number | string, projectId: number | string): string {
    return `${API_URL}/tasks/${taskId}/project/${projectId}`
}

export function updateTaskUrl(taskId: number | string): string {
    return `${API_URL}/tasks/${taskId}`
}

export function reorderTasksUrl(projectId: number | string): string {
    return `${API_URL}/tasks/project/${projectId}/reorder`
}

export function moveTaskUrl(taskId: number | string): string {
    return `${API_URL}/tasks/${taskId}/move`
}

export function deleteTaskUrl(taskId: number | string, projectId: number | string): string {
    return `${API_URL}/tasks/${taskId}/project/${projectId}`
}

// ===============================================================
// =================  Comments Module Functions  =================
// ===============================================================
export function commentsByTaskUrl(taskId: number | string): string {
    return `${API_URL}/comments/task/${taskId}`
}

export function createCommentUrl(taskId: number | string): string {
    return `${API_URL}/comments/task/${taskId}`
}

export function deleteCommentUrl(commentId: number | string, taskId: number | string): string {
    return `${API_URL}/comments/${commentId}/task/${taskId}`
}

// ===============================================================
// =================  Statistics Module Functions  ===============
// ===============================================================
export function globalStatsUrl(): string {
    return `${API_URL}/stats/global`
}

export function projectStatsUrl(projectId: number | string): string {
    return `${API_URL}/stats/project/${projectId}`
}

export function userStatsUrl(userId: string): string {
    return `${API_URL}/stats/user/${userId}`
}
