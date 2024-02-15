package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.tasks.Tag;

public interface TagRepository extends JpaRepository<Tag, UUID> {
  Tag findByName(String name);

}
