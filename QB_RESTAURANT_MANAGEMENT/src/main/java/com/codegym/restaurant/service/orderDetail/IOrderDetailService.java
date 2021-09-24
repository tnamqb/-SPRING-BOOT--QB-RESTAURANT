package com.codegym.restaurant.service.orderDetail;

import com.codegym.restaurant.model.OrderDetail;
import com.codegym.restaurant.service.IGeneralService;

import java.util.Optional;

public interface IOrderDetailService extends IGeneralService<OrderDetail> {

    Iterable<OrderDetail> findAllByOrderOrderId(Long id);

    Optional<OrderDetail> findByOrderOrderIdAndProductProductId(Long id1, Long id2);

}
