package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface OrganizationProjectRepository extends JpaRepository<OrganizationProject, Long> {
    @EntityGraph(attributePaths = {"project"})
    @Query("""
           SELECT o FROM OrganizationProject o
           WHERE o.organization.id = :id
           ORDER BY o.project.createdAt
           """)
    Set<OrganizationProject> findAllByOrganization_Id(Long id);

    Optional<OrganizationProject> findByOrganization_IdAndProject_Id(Long id, Long projectId);

    void deleteByProject(Project project);

}