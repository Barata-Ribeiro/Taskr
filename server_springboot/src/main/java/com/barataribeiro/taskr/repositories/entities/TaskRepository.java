package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}