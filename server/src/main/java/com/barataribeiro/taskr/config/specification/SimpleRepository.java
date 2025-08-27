package com.barataribeiro.taskr.config.specification;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.util.Assert;

import java.io.Serializable;
import java.util.List;

import static org.springframework.data.jpa.repository.query.QueryUtils.toOrders;

public class SimpleRepository<E, ID extends Serializable> extends SimpleJpaRepository<E, ID>
        implements RepositorySpecificationExecutor<E, ID> {
    private final EntityManager entityManager;
    private final JpaEntityInformation<E, ID> entityInformation;

    public SimpleRepository(JpaEntityInformation<E, ID> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityInformation = entityInformation;
        this.entityManager = entityManager;
    }

    protected static long executeCountQuery(TypedQuery<Long> query) {
        Assert.notNull(query, "TypedQuery must not be null!");

        List<Long> totals = query.getResultList();
        long total = 0L;

        for (Long element : totals) {
            total += element == null ? 0 : element;
        }

        return total;
    }

    @Override
    public Page<ID> findEntityIds(@NotNull Pageable pageable) {
        CriteriaBuilder criteriaBuilder = this.entityManager.getCriteriaBuilder();
        CriteriaQuery<ID> criteriaQuery = criteriaBuilder.createQuery(this.entityInformation.getIdType());
        Root<E> root = criteriaQuery.from(this.getDomainClass());

        Path<?> idPath = root.get(this.entityInformation.getIdAttribute());
        criteriaQuery.select(idPath.as(this.entityInformation.getIdType()));

        Sort sort = pageable.isPaged() ? pageable.getSort() : Sort.unsorted();
        if (sort.isSorted()) {
            criteriaQuery.orderBy(toOrders(sort, root, criteriaBuilder));
        }

        TypedQuery<ID> typedQuery = this.entityManager.createQuery(criteriaQuery);

        if (pageable.isPaged()) {
            typedQuery.setFirstResult((int) pageable.getOffset());
            typedQuery.setMaxResults(pageable.getPageSize());
        }

        return PageableExecutionUtils.getPage(typedQuery.getResultList(), pageable,
                                              () -> executeCountQuery(this.getCountQuery(null, this.getDomainClass())));
    }
}