package com.barataribeiro.taskr.utils.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginReturnDTO {
    String accessToken;
    String secondAccessToken;
}
