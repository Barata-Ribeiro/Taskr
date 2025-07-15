package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.stats.dtos.UserStatsDTO;
import com.barataribeiro.taskr.stats.dtos.counts.UserCountDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username);

    @Query("""
           select u from User u
           where lower(u.username) = lower(:term) or lower(u.email) = lower(:term)
           """)
    Optional<User> findUserByUsernameOrEmailAllIgnoreCase(@Param("term") String term);

    boolean existsByUsernameOrEmailAllIgnoreCase(String username, String email);

    long countByUsername(String username);

    @Query("""
           select new com.barataribeiro.taskr.stats.dtos.counts.UserCountDTO(
               count(u),
               sum(case when u.role = 'NONE' then 1 else 0 end),
               sum(case when u.role = 'USER' then 1 else 0 end),
               sum(case when u.role = 'ADMIN' then 1 else 0 end),
               sum(case when u.role = 'BANNED' then 1 else 0 end),
               sum(case when u.isVerified then 1 else 0 end),
               sum(case when not u.isVerified then 1 else 0 end))
           from User u
           """)
    UserCountDTO getUserCount();

    @Query("""
           select new com.barataribeiro.taskr.stats.dtos.UserStatsDTO(
                count(p),
                count(t),
                count(c),
                sum(case when m.role = 'MEMBER' then 1 else 0 end))
           from User u
           left join u.projects p
           left join u.assignedTasks t
           left join u.comments c
           left join u.memberships m
           where u.id = :userId
           """)
    UserStatsDTO getUserStats(UUID userId);

    long deleteByUsername(String username);
}
