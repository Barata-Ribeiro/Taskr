package com.barataribeiro.taskr.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username);

    @Query("""
           select u from User u
           where lower(u.username) = lower(:term) or lower(u.email) = lower(:term)
           """)
    Optional<User> findUserByUsernameOrEmailAllIgnoreCase(@Param("term") String term);

    List<User> findAllByRole(Roles role);

    boolean existsByUsernameOrEmailAllIgnoreCase(String username, String email);

    long countByUsername(String username);
}
