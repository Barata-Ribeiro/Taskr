package com.barataribeiro.taskr.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.jackson.JsonNodeValueReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration().setFieldMatchingEnabled(true)
                   .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                   .setMatchingStrategy(MatchingStrategies.STRICT)
                   .setSkipNullEnabled(true);

        modelMapper.getConfiguration().addValueReader(new JsonNodeValueReader());

        return modelMapper;
    }
}