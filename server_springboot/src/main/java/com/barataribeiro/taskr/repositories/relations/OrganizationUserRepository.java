package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.OrganizationUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface OrganizationUserRepository extends JpaRepository<OrganizationUser, Long> {
    @Query("select (count(o) > 0) from OrganizationUser o where o.user.id = :userId and o.isOwner = :isOwner")
    boolean existsOrganizationWhereUserByIdIsOwner(String userId, boolean isOwner);

    boolean existsByOrganization_IdAndUser_Id(Integer id, String userId);

    boolean existsByUser_Id(String id);

    @Query("select o from OrganizationUser o where o.organization.id = :id " +
            "and o.user.username = :username and o.isOwner = :isOwner")
    Optional<OrganizationUser> findOrganizationByUser_UsernameAndIsOwner(Integer id, String username, boolean isOwner);

    @EntityGraph(attributePaths = {"user"})
    @Query("select o from OrganizationUser o where o.organization.id = :id")
    Set<OrganizationUser> findAllByOrganization_Id(Integer id);

}