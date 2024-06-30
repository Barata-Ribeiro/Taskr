package com.barataribeiro.taskr.dtos.organization;

import org.jetbrains.annotations.NotNull;

import java.io.Serializable;
import java.util.Arrays;

public record ManagementRequestDTO(String[] usersToAdd, String[] usersToRemove) implements Serializable {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ManagementRequestDTO that = (ManagementRequestDTO) o;
        return Arrays.equals(usersToAdd, that.usersToAdd) && Arrays.equals(usersToRemove, that.usersToRemove);
    }

    @Override
    public int hashCode() {
        int result = Arrays.hashCode(usersToAdd);
        result = 31 * result + Arrays.hashCode(usersToRemove);
        return result;
    }

    @Override
    public @NotNull String toString() {
        return "ManagementRequestDTO{" +
                "usersToAdd=" + Arrays.toString(usersToAdd) +
                ", usersToRemove=" + Arrays.toString(usersToRemove) +
                '}';
    }
}
