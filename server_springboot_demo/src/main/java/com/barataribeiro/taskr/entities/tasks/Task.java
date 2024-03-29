package com.barataribeiro.taskr.entities.tasks;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.barataribeiro.taskr.entities.comment.Comment;
import com.barataribeiro.taskr.entities.project.Project;
import com.barataribeiro.taskr.entities.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "taskr_tasks")
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  private String title;

  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "projectId")
  private List<Project> projects;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "creatorId")
  private List<User> creator;

  @ColumnDefault("'PLANNED'")
  private StatusEnum status;

  @ColumnDefault("'LOW'")
  private PriorityEnum priority;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(nullable = false)
  private LocalDate dueDate;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "task", cascade = CascadeType.ALL)
  private List<Comment> comments;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "taskr_tasks_assignees", joinColumns = @JoinColumn(name = "taskId"), inverseJoinColumns = @JoinColumn(name = "userId"))
  private List<User> assignees;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "taskr_tasks_tags", joinColumns = @JoinColumn(name = "taskId"), inverseJoinColumns = @JoinColumn(name = "tagId"))
  private List<Tag> tags;

  @CreatedDate
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "created_at", nullable = false, updatable = false)
  private Date createdAt;

  @LastModifiedDate
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "updated_at")
  private Date updatedAt;

}
