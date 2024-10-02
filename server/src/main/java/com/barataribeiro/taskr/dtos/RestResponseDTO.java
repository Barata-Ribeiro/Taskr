package com.barataribeiro.taskr.dtos;

import org.springframework.http.HttpStatus;

public record RestResponseDTO<T>(HttpStatus status,
                                 int code,
                                 String message,
                                 T data) {}