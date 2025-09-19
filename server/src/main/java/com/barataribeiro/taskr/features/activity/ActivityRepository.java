package com.barataribeiro.taskr.features.activity;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import io.lettuce.core.dynamic.annotation.Param;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long>,
        RepositorySpecificationExecutor<Activity, Long> {
    @Query("select a.id from Activity a join a.project where a.project.id = :projectId")
    Page<Long> findAllIdsByProject_Id(@Param("projectId") Long projectId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"project"})
    @NotNull List<Activity> findAll(Specification<Activity> specification);

    @Modifying
    @Query("update Activity a set a.username = :newUsername where a.username = :oldUsername")
    void updateUsernameForAllActivities(@Param("oldUsername") String oldUsername,
                                        @Param("newUsername") String newUsername);
}