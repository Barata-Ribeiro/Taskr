package com.barataribeiro.taskr.stats.dtos;

import com.barataribeiro.taskr.stats.dtos.counts.ProjectsCountDTO;
import com.barataribeiro.taskr.stats.dtos.counts.UserCountDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GlobalStatsDTO {
    private UserCountDTO userCountDTO;
    private ProjectsCountDTO projectsCountDTO;
    private long totalTasks;
    private long totalComments;
    private long totalMemberships;
    private long totalActivities;
}

