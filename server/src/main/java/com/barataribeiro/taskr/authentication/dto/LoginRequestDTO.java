package com.barataribeiro.taskr.authentication.dto;

import com.barataribeiro.taskr.utils.BooleanDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginRequestDTO implements Serializable {

    @NotBlank
    private String usernameOrEmail;

    @NotBlank
    private String password;

    @JsonDeserialize(using = BooleanDeserializer.class)
    private Boolean rememberMe;
}
