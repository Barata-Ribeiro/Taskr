package com.barataribeiro.taskr.helpers;

import org.springframework.http.HttpStatus;

public record RestResponse<T>(HttpStatus status,
                              int code,
                              String message,
                              T data) {
}
