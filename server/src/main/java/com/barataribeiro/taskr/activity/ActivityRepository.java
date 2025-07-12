package com.barataribeiro.taskr.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ActivityRepository extends JpaRepository<Activity, Long>, JpaSpecificationExecutor<Activity> {
    Page<Activity> findAllByProject_Id(Long projectId, Pageable pageable);

    long countByProject_Id(Long projectId);
}