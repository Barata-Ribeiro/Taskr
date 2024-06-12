package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.ProjectUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {
    @EntityGraph(attributePaths = {"user"})
    @Query("select p from ProjectUser p where p.project.id = :id order by p.user.username")
    Set<ProjectUser> findAllByProject_Id(Integer id);

    @Query("""
            select (count(p) > 0) from ProjectUser p
            where p.project.id = :id and p.user.id = :userId and p.isProjectManager = :isProjectManager""")
    boolean existsProjectWhereUserByIdIsManager(Integer id, String userId, boolean isProjectManager);

}