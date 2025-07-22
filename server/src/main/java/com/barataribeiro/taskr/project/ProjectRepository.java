package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO;
import com.barataribeiro.taskr.stats.dtos.counts.ProjectsCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    @EntityGraph(attributePaths = {"owner"})
    Page<Project> findAllByOwner_Username(@Param("ownerUsername") String ownerUsername, Pageable pageable);

    @Query(value = """
                   select
                        count(*) as totalProjects,
                        sum(case when created_at >= current_timestamp - interval '7' day then 1 else 0 end) as totalProjectsLast7Days,
                        sum(case when created_at >= current_timestamp - interval '30' day then 1 else 0 end) as totalProjectsLast30Days,
                        sum(case when status = 'NOT_STARTED' then 1 else 0 end) as totalStatusNotStarted,
                        sum(case when status = 'IN_PROGRESS' then 1 else 0 end) as totalStatusInProgress,
                        sum(case when status = 'COMPLETED' then 1 else 0 end) as totalStatusCompleted,
                        sum(case when status = 'ON_HOLD' then 1 else 0 end) as totalStatusOnHold,
                        sum(case when status = 'CANCELLED' then 1 else 0 end) as totalStatusCancelled,
                        sum(case when due_date < current_timestamp and status != 'COMPLETED' then 1 else 0 end) as totalOverdue
                   from "tb_projects"
                   """, nativeQuery = true)
    ProjectsCountDTO getProjectsCount();

    @Query("""
           select new com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO(
                count(distinct t),
                sum(case when t.status = 'TO_DO' then 1 else 0 end),
                sum(case when t.status = 'IN_PROGRESS' then 1 else 0 end),
                sum(case when t.status = 'DONE' then 1 else 0 end),
                sum(case when t.dueDate < current_timestamp and t.status != 'DONE' then 1 else 0 end),
                (select count(distinct c) from Task t2 left join t2.comments c where t2.project.id = :projectId),
                (select count(distinct m) from Project p2 left join p2.memberships m where p2.id = :projectId),
                (select count(distinct a) from Project p3 left join p3.feed a where p3.id = :projectId))
           from Project p
           left join p.tasks t
           where p.id = :projectId
           """)
    ProjectStatsDTO getProjectCount(@Param("projectId") Long projectId);

    @EntityGraph(attributePaths = {"owner"})
    long deleteByIdAndOwner_Username(@Param("id") Long id, @Param("username") String username);
}