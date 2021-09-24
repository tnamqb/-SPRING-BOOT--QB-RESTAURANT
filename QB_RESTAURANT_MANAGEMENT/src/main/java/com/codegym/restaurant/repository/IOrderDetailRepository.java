package com.codegym.restaurant.repository;

import com.codegym.restaurant.model.OrderDetail;
import com.codegym.restaurant.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    Iterable<OrderDetail> findAllByOrderOrderId(Long id);

    Optional<OrderDetail> findByOrderOrderIdAndProductProductId(Long id1, Long id2);
}
