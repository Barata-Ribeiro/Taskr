package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.organization.AlreadyCreatedOrganization;
import com.barataribeiro.taskr.exceptions.organization.OrganizationAlreadyExists;
import com.barataribeiro.taskr.exceptions.organization.OrganizationNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class OrganizationExceptionHandler {
    @ExceptionHandler(OrganizationNotFound.class)
    private ResponseEntity<RestErrorMessage> organizationNotFound(OrganizationNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(OrganizationAlreadyExists.class)
    private ResponseEntity<RestErrorMessage> organizationAlreadyExists(OrganizationAlreadyExists exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }

    @ExceptionHandler(AlreadyCreatedOrganization.class)
    private ResponseEntity<RestErrorMessage> alreadyCreatedOrganization(AlreadyCreatedOrganization exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }
}
