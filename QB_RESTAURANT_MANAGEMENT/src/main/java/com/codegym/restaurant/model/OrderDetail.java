package com.codegym.restaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Min;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderDetails")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;

    @Column(nullable = false)
    @Min(0)
    private int amount;

    @Column(nullable = false)
    @Min(0)
    private Double productPrice;

    @Column(nullable = false, columnDefinition = "false")
    private  boolean status;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "orderId")
    private Order order;

    public OrderDetail(Double productPrice, Product product, Order order) {
        this.productPrice = productPrice;
        this.product = product;
        this.order = order;
    }

    public OrderDetail(int amount, Double productPrice, boolean status, Product product, Order order) {
        this.amount = amount;
        this.productPrice = productPrice;
        this.status = status;
        this.product = product;
        this.order = order;
    }
}
