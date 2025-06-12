package com.barataribeiro.taskr.membership;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MembershipRepository extends JpaRepository<Membership, Long>, JpaSpecificationExecutor<Membership> {
    boolean existsByProject_IdAndUser_Username(Long projectId, String username);
}