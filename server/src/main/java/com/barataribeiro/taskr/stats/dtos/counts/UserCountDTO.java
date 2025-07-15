package com.barataribeiro.taskr.stats.dtos.counts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserCountDTO {
    private Long totalUsers;
    private Long totalRoleNone;
    private Long totalRoleUser;
    private Long totalRoleAdmin;
    private Long totalRoleBanned;
    private Long totalVerified;
    private Long totalUnverified;
}