package com.barataribeiro.taskr.stats.dtos.counts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserCountDTO implements Serializable {
    private Long totalUsers;
    private Long totalLast7Days;
    private Long totalLast30Days;
    private Long totalRoleNone;
    private Long totalRoleUser;
    private Long totalRoleAdmin;
    private Long totalRoleBanned;
    private Long totalVerified;
    private Long totalUnverified;
}