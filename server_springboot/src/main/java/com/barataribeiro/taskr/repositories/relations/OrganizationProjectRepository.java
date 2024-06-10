package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.OrganizationProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationProjectRepository extends JpaRepository<OrganizationProject, Long> {
}