package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Integer> {
}