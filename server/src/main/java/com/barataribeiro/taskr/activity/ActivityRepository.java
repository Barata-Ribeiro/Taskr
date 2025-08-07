package com.barataribeiro.taskr.activity;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

public interface ActivityRepository extends JpaRepository<Activity, Long>, JpaSpecificationExecutor<Activity> {
    @EntityGraph(attributePaths = {"project"})
    Page<Activity> findAllByProject_Id(Long projectId, Pageable pageable);

    @Modifying
    @Query("update Activity a set a.username = :newUsername where a.username = :oldUsername")
    void updateUsernameForAllActivities(@Param("oldUsername") String oldUsername,
                                        @Param("newUsername") String newUsername);
}