package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    List<Organization> findDistinctTop3ByOrderByCreatedAtDesc();

    @Query("""
           SELECT o FROM Organization o
           WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.description) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.location) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.websiteUrl) LIKE LOWER(CONCAT('%', :term, '%'))
           """)
    Page<Organization> findAllOrganizationsWithParamsPaginated(@Param("term") String term, Pageable pageable);
}