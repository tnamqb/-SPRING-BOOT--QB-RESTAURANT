package com.codegym.restaurant.service.order;

import com.codegym.restaurant.model.Order;
import com.codegym.restaurant.model.OrderDetail;
import com.codegym.restaurant.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrderService implements IOrderService{
    @Autowired
    private IOrderRepository orderRepository;

    @Override
    public Iterable<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public void remove(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Optional<Order> findByTableId(Long id){
        return orderRepository.findByTableId(id);
    }

    @Override
    public Optional<Order> findByOrderId(Long id) {
        return orderRepository.findByOrderId(id);
    }

    ;
}
