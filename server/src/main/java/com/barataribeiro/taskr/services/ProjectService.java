package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;

import java.security.Principal;
import java.util.Map;

public interface ProjectService {
    ProjectDTO createProject(String orgId, ProjectCreateRequestDTO body, Principal principal);

    Map<String, Object> getProjectInfo(String orgId, String projectId);

    Map<String, Object> getProjectMembers(String orgId, String projectId);

    Map<String, Object> getProjectTasks(String orgId, String projectId);

    Map<String, Object> updateProject(String orgId, String projectId, ProjectUpdateRequestDTO body,
                                      Principal principal);

    Map<String, Object> changeProjectStatus(String projectId, String taskId, String status, Principal principal);

    void deleteProject(String orgId, String projectId, Principal principal);
}
