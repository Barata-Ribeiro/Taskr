package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.user.PasswordDoesNotMatch;
import com.barataribeiro.taskr.exceptions.user.UserAlreadyExists;
import com.barataribeiro.taskr.exceptions.user.UserIsBanned;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

public class UserExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(UserNotFound.class)
    private ResponseEntity<RestErrorMessage> userNotFound(UserNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(UserIsBanned.class)
    private ResponseEntity<RestErrorMessage> userIsBanned(UserIsBanned exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorMessage);
    }

    @ExceptionHandler(UserAlreadyExists.class)
    private ResponseEntity<RestErrorMessage> userAlreadyExists(UserAlreadyExists exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }

    @ExceptionHandler(PasswordDoesNotMatch.class)
    private ResponseEntity<RestErrorMessage> passwordDoesNotMatch(PasswordDoesNotMatch exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }
}
