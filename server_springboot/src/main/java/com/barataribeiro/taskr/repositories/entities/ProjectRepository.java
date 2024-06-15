package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}