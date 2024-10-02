package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    @Query("""
           SELECT DISTINCT o FROM Organization o
           ORDER BY o.createdAt
           """)
    Page<Organization> findAllOrganizationsPageable(Pageable pageable);

    List<Organization> findDistinctTop3ByOrderByCreatedAtDesc();
}