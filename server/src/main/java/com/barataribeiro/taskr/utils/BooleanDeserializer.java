package com.barataribeiro.taskr.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;

public class BooleanDeserializer extends JsonDeserializer<Boolean> {

    @Override
    public Boolean deserialize(@NotNull JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();

        if (value != null && !value.equals("true") && !value.equals("false")) {
            throw new IllegalArgumentException("Invalid boolean value, expected 'true' or 'false' but got: " + value);
        }

        return Boolean.valueOf(value);
    }
}