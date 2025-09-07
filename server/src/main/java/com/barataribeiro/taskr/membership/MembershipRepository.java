package com.barataribeiro.taskr.membership;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long>, JpaSpecificationExecutor<Membership> {
    boolean existsByUser_UsernameAndProject_Id(@Param("username") String username, @Param("projectId") Long projectId);

    boolean existsByUser_UsernameAndProject_Tasks_Id(@Param("username") String username, @Param("taskId") Long taskId);

    @EntityGraph(attributePaths = {"project", "user"})
    Optional<Membership> findByUser_UsernameAndProject_Id(@Param("username") String username,
                                                          @Param("projectId") Long projectId);

    @EntityGraph(attributePaths = {"project", "user"})
    Streamable<Membership> findByProject_Id(Long id);
}