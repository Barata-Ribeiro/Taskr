package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.comment.Comment;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

}
