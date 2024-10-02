package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.OrganizationUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

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
    @Query("""
           SELECT o FROM OrganizationUser o
           WHERE o.organization.id = :id
           ORDER BY o.user.username
           """)
    Set<OrganizationUser> findAllByOrganization_Id(Long id);

}