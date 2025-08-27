package com.barataribeiro.taskr.config.specification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface RepositorySpecificationExecutor<E, ID extends Serializable> extends JpaSpecificationExecutor<E> {
    Page<ID> findEntityIds(Pageable pageable);
}
