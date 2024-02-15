package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.team.Team;

public interface TeamRepository extends JpaRepository<Team, UUID> {
  Team findByName(String name);

}
