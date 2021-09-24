package com.codegym.restaurant.repository;

import com.codegym.restaurant.model.Desk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IDeskRepository extends JpaRepository<Desk, Long> {
    Iterable<Desk> findAllByOrderByTableIdAsc();

    @Query("SELECT d FROM Desk d WHERE d.tableId <> :id and d.custom = true")
    Iterable<Desk> findAllByCustomIsTrue(@Param("id") Long id);

    Optional<Desk> findByTableName(String tableName);

    @Query("SELECT d FROM Desk d WHERE d.custom = false")
    Iterable<Desk> findDeskChange();

    @Query("SELECT d from Desk d where d.tableId <> :id")
    Iterable<Desk> findAllDeskSplit(@Param("id") Long id);
}
