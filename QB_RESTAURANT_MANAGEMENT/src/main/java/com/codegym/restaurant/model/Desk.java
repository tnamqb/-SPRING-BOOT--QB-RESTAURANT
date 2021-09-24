package com.codegym.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tables")
public class Desk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    @Column(nullable = false)
    @Size(min = 1, max = 50)
    private String tableName;

    @Column(columnDefinition = "boolean default false")
    private boolean custom;

    private String book;

    @Column(columnDefinition = "boolean default true")
    private boolean hidden;

    @JsonIgnore
    @OneToMany(targetEntity = Order.class)
    private List<Order> orders;

    public Desk(String tableName) {
        this.tableName = tableName;
    }



    public Desk(Long tableId) {
        this.tableId = tableId;
    }
}
