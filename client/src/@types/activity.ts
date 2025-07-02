enum ActivityType {
    CREATE_PROJECT = "CREATE_PROJECT",
    UPDATE_PROJECT = "UPDATE_PROJECT",
    DELETE_PROJECT = "DELETE_PROJECT",
    ADD_TASK = "ADD_TASK",
    UPDATE_TASK = "UPDATE_TASK",
    DELETE_TASK = "DELETE_TASK",
    ASSIGN_TASK = "ASSIGN_TASK",
    UNASSIGN_TASK = "UNASSIGN_TASK",
    COMPLETE_TASK = "COMPLETE_TASK",
    REOPEN_TASK = "REOPEN_TASK",
    ADD_COMMENT = "ADD_COMMENT",
    UPDATE_COMMENT = "UPDATE_COMMENT",
    DELETE_COMMENT = "DELETE_COMMENT",
    ADD_MEMBER = "ADD_MEMBER",
    REMOVE_MEMBER = "REMOVE_MEMBER",
}

interface Activity {
    id: number
    username: string
    action: ActivityType
    description: string
    createdAt: string
    updatedAt: string
}

export { ActivityType, type Activity }
