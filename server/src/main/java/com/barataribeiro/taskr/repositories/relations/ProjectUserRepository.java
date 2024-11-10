package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {
    @EntityGraph(attributePaths = {"user"})
    @Query("""
           SELECT p FROM ProjectUser p
           WHERE p.project.id = :id
           ORDER BY p.user.username
           """)
    Set<ProjectUser> findAllByProject_Id(Long id);

    @Query("""
           SELECT (COUNT (p) > 0) FROM ProjectUser p
           WHERE p.project.id = :id AND p.user.id = :userId AND p.isProjectManager = :isProjectManager""")
    boolean existsProjectWhereUserByIdIsManager(Long id, String userId, boolean isProjectManager);

    void deleteByProject(Project project);

    boolean existsByProject_IdAndUser_Id(Long id, String userId);

    void deleteById_ProjectIdAndId_UserId(Long projectId, String userId);
}