package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO;
import com.barataribeiro.taskr.stats.dtos.counts.ProjectsCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    @EntityGraph(attributePaths = {"owner"})
    Page<Project> findAllByOwner_Username(String ownerUsername, Pageable pageable);

    @Query("""
           select new com.barataribeiro.taskr.stats.dtos.counts.ProjectsCountDTO(
                count(distinct p),
                sum(case when p.status = 'NOT_STARTED' then 1 else 0 end),
                sum(case when p.status = 'IN_PROGRESS' then 1 else 0 end),
                sum(case when p.status = 'COMPLETED' then 1 else 0 end),
                sum(case when p.status = 'ON_HOLD' then 1 else 0 end),
                sum(case when p.status = 'CANCELLED' then 1 else 0 end),
                sum(case when p.dueDate < current_timestamp and p.status != 'COMPLETED' then 1 else 0 end))
           from Project p
           """)
    ProjectsCountDTO getProjectsCount();

    @Query("""
           select new com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO(
                count(distinct t),
                sum(case when t.status = 'TO_DO' then 1 else 0 end),
                sum(case when t.status = 'IN_PROGRESS' then 1 else 0 end),
                sum(case when t.status = 'DONE' then 1 else 0 end),
                count(distinct c),
                count(distinct m),
                count(distinct a))
           from Project p
           left join p.tasks t
           left join t.comments c
           left join p.memberships m
           left join p.feed a
           where p.id = :projectId
           """)
    ProjectStatsDTO getProjectCount(Long projectId);
}