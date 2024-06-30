package com.barataribeiro.taskr.dtos.user;

public record UpdateAccountRequestDTO(String username,
                                      String displayName,
                                      String newPassword,
                                      String currentPassword) {
}
