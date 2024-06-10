package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.ProjectUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {
}