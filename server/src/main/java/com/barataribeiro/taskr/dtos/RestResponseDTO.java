package com.barataribeiro.taskr.dtos;

import org.springframework.http.HttpStatus;

import java.io.Serializable;

public record RestResponseDTO(HttpStatus status,
                              int code,
                              String message,
                              Object data) implements Serializable {
}
