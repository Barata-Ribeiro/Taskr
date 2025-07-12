package com.barataribeiro.taskr.stats.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GlobalStatsDTO {
    private long totalUsers;
    private long totalProjects;
    private long totalTasks;
    private long totalComments;
    private long totalMemberships;
    private long totalActivities;
}

