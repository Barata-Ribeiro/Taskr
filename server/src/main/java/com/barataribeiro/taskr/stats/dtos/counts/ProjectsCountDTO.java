package com.barataribeiro.taskr.stats.dtos.counts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectsCountDTO {
    private long totalProjects;
    private long totalProjectsLast7Days;
    private long totalProjectsLast30Days;
    private long totalStatusNotStarted;
    private long totalStatusInProgress;
    private long totalStatusCompleted;
    private long totalStatusOnHold;
    private long totalStatusCancelled;
    private long totalOverdue;
}
