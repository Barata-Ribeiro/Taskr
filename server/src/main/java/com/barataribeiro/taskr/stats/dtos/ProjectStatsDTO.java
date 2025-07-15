package com.barataribeiro.taskr.stats.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectStatsDTO {
    private long totalTasks;
    private long tasksToDo;
    private long tasksInProgress;
    private long tasksDone;
    private long totalOverdueTasks;
    private long totalComments;
    private long totalMembers;
    private long totalActivities;
}

