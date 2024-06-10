package com.barataribeiro.taskr.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "taskr_organization", indexes = {
        @Index(name = "idx_organization_name_unq", columnList = "name", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_organization_name", columnNames = {"name"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotEmpty
    private String name;

    private String description;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}