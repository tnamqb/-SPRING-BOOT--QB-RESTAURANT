package com.codegym.restaurant.repository;

import com.codegym.restaurant.model.Desk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDeskRepository extends JpaRepository<Desk, Long> {
    Optional<Desk> findByTableName(String tableName);
}
