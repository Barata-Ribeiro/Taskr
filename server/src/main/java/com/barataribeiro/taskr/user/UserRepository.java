package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import com.barataribeiro.taskr.stats.dtos.UserStatsDTO;
import com.barataribeiro.taskr.stats.dtos.counts.UserCountDTO;
import com.barataribeiro.taskr.user.dtos.UserSearchDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, RepositorySpecificationExecutor<User, UUID> {

    @Query("""
           select new com.barataribeiro.taskr.user.dtos.UserSearchDTO(u.id, u.username, u.createdAt) from User u
               where lower(u.username) ilike concat('%', lower(:term), '%')
               or lower(u.email) ilike concat('%', lower(:term), '%')
               or lower(u.displayName) ilike concat('%', lower(:term), '%')
               or lower(u.fullName) ilike concat('%', lower(:term), '%')
           order by u.username asc
           """)
    Set<UserSearchDTO> searchAllUsernamesByTerm(@Param("term") String term);

    Optional<User> findByUsername(@Param("username") String username);

    @Query("""
           select u from User u
           where lower(u.username) = lower(:term) or lower(u.email) = lower(:term)
           """)
    Optional<User> findUserByUsernameOrEmailAllIgnoreCase(@Param("term") String term);

    boolean existsByUsernameOrEmailAllIgnoreCase(@Param("username") String username, @Param("email") String email);

    long countByUsername(@Param("username") String username);

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
    UserStatsDTO getUserStats(@Param("userId") UUID userId);

    @Query(value = """
                   select
                       count(*) as totalUsers,
                       sum(case when created_at >= current_timestamp - interval '7' day then 1 else 0 end) as totalLast7Days,
                       sum(case when created_at >= current_timestamp - interval '30' day then 1 else 0 end) as totalLast30Days,
                       sum(case when role = 'NONE' then 1 else 0 end) as totalRoleNone,
                       sum(case when role = 'USER' then 1 else 0 end) as totalRoleUser,
                       sum(case when role = 'ADMIN' then 1 else 0 end) as totalRoleAdmin,
                       sum(case when role = 'BANNED' then 1 else 0 end) as totalRoleBanned,
                       sum(case when is_verified then 1 else 0 end) as totalVerified,
                       sum(case when not is_verified then 1 else 0 end) as totalUnverified
                   from "tb_users"
                   """, nativeQuery = true)
    UserCountDTO getUserCount();

    long deleteByUsername(@Param("username") String username);
}
