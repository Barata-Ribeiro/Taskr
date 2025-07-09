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
