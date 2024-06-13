package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.TaskUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {
}