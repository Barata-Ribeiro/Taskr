package com.barataribeiro.taskr.dtos.user;

public record UpdateAccountRequestDTO(String username,
                                      String displayName,
                                      String firstName,
                                      String lastName,
                                      String avatarUrl,
                                      String newPassword,
                                      String currentPassword) {}
