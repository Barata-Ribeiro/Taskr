package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.tasks.Task;

public interface TaskRepository extends JpaRepository<Task, UUID> {
  Task findByName(String name);

}
