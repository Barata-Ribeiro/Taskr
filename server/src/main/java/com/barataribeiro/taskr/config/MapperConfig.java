package com.barataribeiro.taskr.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.modelmapper.config.Configuration.AccessLevel.PRIVATE;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration().setFieldMatchingEnabled(true)
                   .setFieldAccessLevel(PRIVATE)
                   .setMatchingStrategy(MatchingStrategies.STRICT)
                   .setSkipNullEnabled(true);

        return modelMapper;
    }
}
