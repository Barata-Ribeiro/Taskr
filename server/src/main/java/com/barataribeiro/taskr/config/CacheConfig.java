package com.barataribeiro.taskr.config;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.jackson.JsonMixinModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.Duration;
import java.util.List;

@Configuration
public class CacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
                .json()
                .mixIn(PageImpl.class, PageMixin.class)
                .mixIn(Pageable.class, PageRequestMixin.class)
                .mixIn(Sort.class, SortMixin.class)
                .build();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.registerModule(new JsonMixinModule());
        objectMapper.activateDefaultTyping(objectMapper.getPolymorphicTypeValidator(),
                                           ObjectMapper.DefaultTyping.NON_FINAL,
                                           JsonTypeInfo.As.PROPERTY);

        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration
                .defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                                           .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                                             .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));

        return RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(redisCacheConfiguration).build();
    }

    public abstract static class PageMixin<T> {
        @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
        protected PageMixin(@JsonProperty("content") List<T> content,
                            @JsonProperty("pageable") Pageable pageable,
                            @JsonProperty("totalElements") long totalElements) {}
    }

    public abstract static class PageRequestMixin {
        @JsonCreator
        protected PageRequestMixin(@JsonProperty("page") int page,
                                   @JsonProperty("size") int size,
                                   @JsonProperty("sort") Sort sort) {}
    }

    public abstract static class SortMixin {
        @JsonCreator
        protected SortMixin(@JsonProperty("orders") List<Sort.Order> orders) {}
    }
}
