package com.barataribeiro.taskr.features.stats.dtos.counts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectsCountDTO implements Serializable {
    private Long totalProjects;
    private Long totalProjectsLast7Days;
    private Long totalProjectsLast30Days;
    private Long totalStatusNotStarted;
    private Long totalStatusInProgress;
    private Long totalStatusCompleted;
    private Long totalStatusOnHold;
    private Long totalStatusCancelled;
    private Long totalOverdue;
}
