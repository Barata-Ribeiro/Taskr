package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;

import java.security.Principal;
import java.util.Map;

public interface ProjectService {
    ProjectDTO createProject(String orgId, ProjectCreateRequestDTO body, Principal principal);

    ProjectDTO getProjectById(String orgId, String projectId);

    Map<String, Object> getProjectMembers(String orgId, String projectId);

    Map<String, Object> getProjectTasks(String orgId, String projectId);

    ProjectDTO updateProject(String orgId, String projectId, Object body, Principal principal);

    void deleteProject(String orgId, String projectId, Principal principal);
}
