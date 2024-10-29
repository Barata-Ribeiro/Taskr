package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.OrganizationUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrganizationUserRepository extends JpaRepository<OrganizationUser, Long> {
    @Query("""
           SELECT (COUNT (o) > 0) FROM OrganizationUser o
           WHERE o.user.id = :userId AND o.isOwner = :isOwner
           """)
    boolean existsOrganizationWhereUserByIdIsOwner(String userId, boolean isOwner);

    boolean existsByOrganization_IdAndUser_Id(Long id, String userId);

    boolean existsByUser_Id(String id);

    @Query("""
           SELECT o FROM OrganizationUser o
           WHERE o.organization.id = :id AND o.user.username = :username
           AND o.isOwner = :isOwner
           """)
    Optional<OrganizationUser> findOrganizationByUser_UsernameAndIsOwner(Long id, String username, boolean isOwner);

    @EntityGraph(attributePaths = {"user"})
    Page<OrganizationUser> findByOrganization_Id(Long id, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    @Query("""
           SELECT o FROM OrganizationUser o
           WHERE o.organization.id = :id
           AND LOWER(o.user.username) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.user.displayName) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.user.fullName) LIKE LOWER(CONCAT('%', :term, '%'))
           OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :term, '%'))
           """)
    Page<OrganizationUser> findAllUsersWithParamsPaginated(Long id, @Param("term") String term, Pageable pageable);
}