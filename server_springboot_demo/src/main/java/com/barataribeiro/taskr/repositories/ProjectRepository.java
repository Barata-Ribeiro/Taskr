package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.project.Project;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
  Project findByName(String name);

}
