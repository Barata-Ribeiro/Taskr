package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.task.TaskCreateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskUpdateRequestDTO;

import java.security.Principal;
import java.util.Map;

public interface TaskService {
    TaskDTO createTask(String projectId, TaskCreateRequestDTO body, Principal principal);

    Map<String, Object> getTaskInfo(String projectId, String taskId);

    TaskDTO updateTask(String projectId, String taskId,
                       TaskUpdateRequestDTO body, Principal principal);

    void deleteTask(String projectId, String taskId, Principal principal);
}
