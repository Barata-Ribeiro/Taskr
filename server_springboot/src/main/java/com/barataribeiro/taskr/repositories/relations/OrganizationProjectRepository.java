package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.OrganizationProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface OrganizationProjectRepository extends JpaRepository<OrganizationProject, Long> {
    @Query("select o from OrganizationProject o where o.organization.id = :id order by o.project.createdAt")
    Set<OrganizationProject> findAllByOrganization_Id(Integer id);

    Optional<OrganizationProject> findByOrganization_IdAndProject_Id(Integer id, Integer projectId);


}