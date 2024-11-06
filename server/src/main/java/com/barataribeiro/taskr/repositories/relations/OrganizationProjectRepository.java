package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrganizationProjectRepository extends JpaRepository<OrganizationProject, Long> {
    @EntityGraph(attributePaths = {"project"})
    Page<OrganizationProject> findByOrganization_Id(Long id, Pageable pageable);

    @EntityGraph(attributePaths = {"project"})
    @Query("""
           SELECT o FROM OrganizationProject o
           WHERE o.organization.id = :id
           AND LOWER(o.project.name) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.project.description) LIKE LOWER(CONCAT('%', :term, '%'))
           """)
    Page<OrganizationProject> findAllProjectsWithParamsPaginated(Long id, @Param("term") String term,
                                                                 Pageable pageable);

    @EntityGraph(attributePaths = {"project", "organization"})
    Optional<OrganizationProject> findByOrganization_IdAndProject_Id(Long id, Long projectId);

    void deleteByProject(Project project);

}