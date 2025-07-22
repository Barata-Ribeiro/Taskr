package com.barataribeiro.taskr.stats.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserStatsDTO implements Serializable {
    private long totalProjectsOwned;
    private long totalTasksAssigned;
    private long totalCommentsMade;
    private long totalMemberships;
}

