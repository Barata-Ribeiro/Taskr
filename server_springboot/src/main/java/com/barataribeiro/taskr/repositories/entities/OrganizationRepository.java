package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrganizationRepository extends JpaRepository<Organization, Integer> {
    @Query("select distinct o from Organization o order by o.createdAt")
    Page<Organization> getAllOrganizationsPageable(Pageable pageable);
}