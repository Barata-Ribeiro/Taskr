package com.barataribeiro.taskr.utils.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;

@Getter
@AllArgsConstructor
public class LoginReturnDTO implements Serializable {
    String accessToken;
    String secondAccessToken;
}
