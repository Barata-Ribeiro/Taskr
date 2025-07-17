interface UserCount {
    totalUsers: number
    totalLast7Days: number
    totalLast30Days: number
    totalRoleNone: number
    totalRoleUser: number
    totalRoleAdmin: number
    totalRoleBanned: number
    totalVerified: number
    totalUnverified: number
}

interface ProjectsCount {
    totalProjects: number
    totalProjectsLast7Days: number
    totalProjectsLast30Days: number
    totalStatusNotStarted: number
    totalStatusInProgress: number
    totalStatusCompleted: number
    totalStatusOnHold: number
    totalStatusCancelled: number
    totalOverdue: number
}

interface GlobalStats {
    userCount: UserCount
    projectsCount: ProjectsCount
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
    totalOverdueTasks: number
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

export type { UserCount, ProjectsCount, GlobalStats, ProjectStats, UserStats }
