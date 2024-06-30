package com.barataribeiro.taskr.dtos.user;

import com.barataribeiro.taskr.models.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.User}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO implements Serializable {
    private String id;
    private String username;
    private String displayName;
    private String firstName;
    private String lastName;
    private String email;
    private Roles role;
    private String createdAt;
    private String updatedAt;
}