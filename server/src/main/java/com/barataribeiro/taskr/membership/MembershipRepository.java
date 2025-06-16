package com.barataribeiro.taskr.membership;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.util.Streamable;

public interface MembershipRepository extends JpaRepository<Membership, Long>, JpaSpecificationExecutor<Membership> {
    boolean existsByUser_UsernameAndProject_Id(String username, Long projectId);

    Streamable<Membership> findByProject_Id(Long id);
}