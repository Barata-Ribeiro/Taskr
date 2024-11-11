package com.barataribeiro.taskr.dtos.project;

import com.barataribeiro.taskr.utils.FutureDate;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

public record ProjectUpdateRequestDTO(String name,
                                      String description,
                                      
                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                      @FutureDate(message = "Deadline must be a future date.")
                                      LocalDate deadline) implements Serializable {}
