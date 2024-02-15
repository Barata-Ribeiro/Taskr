package com.barataribeiro.taskr.entities.user;

public enum UserRole {
  ADMIN("admin"), MODERATOR("moderator"), USER("user"), BANNED("banned");

  private String role;

  UserRole(String role) {
    this.role = role;
  }

  public String getRole() {
    return role;
  }
}
