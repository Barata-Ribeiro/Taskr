package com.barataribeiro.taskr.membership;

import com.barataribeiro.taskr.project.enums.ProjectRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.util.Streamable;

import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long>, JpaSpecificationExecutor<Membership> {
    @EntityGraph(attributePaths = {"project", "user"})
    Optional<Membership> findByUser_UsernameAndProject_Id(String userUsername, Long projectId);

    @EntityGraph(attributePaths = {"project", "user"})
    boolean existsByUser_UsernameAndProject_Id(String username, Long projectId);

    @EntityGraph(attributePaths = {"project", "user"})
    boolean existsByUser_UsernameAndProject_IdAndRoleIs(String username, Long id, ProjectRole role);

    @EntityGraph(attributePaths = {"project.tasks", "user"})
    boolean existsByUser_UsernameAndProject_Tasks_Id(String username, Long id);

    @EntityGraph(attributePaths = {"project", "user"})
    Streamable<Membership> findByProject_Id(Long id);
}