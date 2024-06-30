package com.barataribeiro.taskr.dtos.project;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.io.Serializable;
import java.util.Arrays;

public record ProjectUpdateRequestDTO(String name,
                                      String description,
                                      String[] usersToAdd) implements Serializable {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectUpdateRequestDTO that = (ProjectUpdateRequestDTO) o;
        return name.equals(that.name) &&
                description.equals(that.description) &&
                Arrays.equals(usersToAdd, that.usersToAdd);
    }

    @Override
    public int hashCode() {
        int result = name.hashCode();
        result = 31 * result + description.hashCode();
        result = 31 * result + Arrays.hashCode(usersToAdd);
        return result;
    }

    @Contract(pure = true)
    @Override
    public @NotNull String toString() {
        return "ProjectUpdateRequestDTO{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", usersToAdd=" + Arrays.toString(usersToAdd) +
                '}';
    }
}
