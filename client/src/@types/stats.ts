interface GlobalStats {
    totalUsers: number
    totalProjects: number
    totalTasks: number
    totalComments: number
    totalMemberships: number
    totalActivities: number
}

interface ProjectStats {
    totalTasks: number
    tasksToDo: number
    tasksInProgress: number
    tasksDone: number
    totalComments: number
    totalMembers: number
    totalActivities: number
}

interface UserStats {
    totalProjectsOwned: number
    totalTasksAssigned: number
    totalCommentsMade: number
    totalMemberships: number
}

export type { GlobalStats, ProjectStats, UserStats }
