package com.codegym.restaurant.controller;


import com.codegym.restaurant.model.Desk;
import com.codegym.restaurant.model.Order;
import com.codegym.restaurant.model.OrderDetail;
import com.codegym.restaurant.repository.IOrderDetailRepository;
import com.codegym.restaurant.service.desk.DeskService;
import com.codegym.restaurant.service.order.IOrderService;
import com.codegym.restaurant.service.orderDetail.IOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
public class DeskController {

    private static String viewMode;

    @Autowired
    private DeskService deskService;

    @Autowired
    private IOrderService orderService;

    @Autowired
    private IOrderDetailService orderDetailService;

    @GetMapping("/desk")
    public ModelAndView listProduct() {
        return new ModelAndView("/dashboard/desk");
    }

    @GetMapping("/allDesk")
    public ResponseEntity<Iterable<Desk>> listAllDesk() {
        return new ResponseEntity<>(deskService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/createDesk")
    public ResponseEntity<Desk> createDesk(@RequestBody Desk desk) {
        desk.setHidden(true);
        String nameTable = desk.getTableName();
        Optional<Desk> deskOptional = deskService.findByName(nameTable);
        if (!deskOptional.isPresent()) {
            return new ResponseEntity<>(deskService.save(desk), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/desk/{id}")
    public ResponseEntity<Desk> deleteDesk(@PathVariable Long id) {
        Optional<Desk> deskOptional = deskService.findById(id);
        if (!deskOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        deskService.remove(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/display")
    public ModelAndView viewDisplay() {
        viewMode = "display";
        ModelAndView modelAndView = new ModelAndView("/dashboard/desk");
        modelAndView.addObject("viewMode", viewMode);
        return modelAndView;
    }

    @GetMapping("/manager")
    public ModelAndView viewManager() {
        viewMode = null;
        ModelAndView modelAndView = new ModelAndView("/dashboard/desk");
        modelAndView.addObject("viewMode", viewMode);
        return modelAndView;
    }

    @PutMapping("/tableHidden/{id}")
    public ResponseEntity<Desk> editTableHidden(@PathVariable Long id) {
        Optional<Desk> deskOptional = deskService.findById(id);
        if (!deskOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Desk desk = deskOptional.get();
        if (desk.isHidden()) {
            desk.setHidden(false);
        } else {
            desk.setHidden(true);
        }
        return new ResponseEntity<>(deskService.save(desk), HttpStatus.OK);
    }

    @GetMapping("/tableBook/{id}")
    public ResponseEntity<Desk> showTableBook(@PathVariable Long id) {
        Optional<Desk> deskOptional = deskService.findById(id);
        if (!deskOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(deskOptional.get(), HttpStatus.OK);
    }

    @PutMapping("/tableBook/{id}")
    public ResponseEntity<Desk> editTableBook(@RequestBody Desk desk, @PathVariable Long id) {
        desk.setTableId(id);
        return new ResponseEntity<>(deskService.save(desk), HttpStatus.OK);
    }

    @PutMapping("/tableCustom/{id}")
    public ResponseEntity<Desk> editTableCustom(@PathVariable Long id) {
        Optional<Desk> deskOptional = deskService.findById(id);
        if (!deskOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Desk desk = deskOptional.get();
        desk.setCustom(true);
        return new ResponseEntity<>(deskService.save(desk), HttpStatus.OK);
    }

    @GetMapping("/deskChange")
    public ResponseEntity<Iterable<Desk>> listDeskChange() {
        return new ResponseEntity<>(deskService.findNameDeskChange(), HttpStatus.OK);
    }

    @PutMapping("/deskChange")
    public ResponseEntity<Order> deskChange(@RequestParam Long id1, Long id2) {
        Optional<Order> orderOptionalChange = orderService.findByTableId(id1);
        if (!orderOptionalChange.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Desk deskChange = deskService.findById(id1).get();
        deskChange.setCustom(false);
        Desk deskNewChange = deskService.findById(id2).get();
        deskNewChange.setCustom(true);
        orderOptionalChange.get().setDesk(deskNewChange);
        return new ResponseEntity<>(orderService.save(orderOptionalChange.get()), HttpStatus.OK);
    }

    @GetMapping("/getAllDeskMerge/{id}")
    public ResponseEntity<Iterable<Desk>> listDeskMerge(@PathVariable Long id) {
        return new ResponseEntity<>(deskService.findAllByCustomIsTrue(id), HttpStatus.OK);
    }

    @PutMapping("/deskMerge")
    public ResponseEntity<Iterable<OrderDetail>> deskMerge(@RequestParam Long id1, Long id2) {
        Optional<Order> orderOptional1 = orderService.findByTableId(id1);
        Optional<Order> orderOptional2 = orderService.findByTableId(id2);
        long idOrder1 = orderOptional1.get().getOrderId();
        long idOrder2 = orderOptional2.get().getOrderId();

        if (!orderOptional1.isPresent() && !orderOptional2.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Iterable<OrderDetail> orderDetails1 = orderDetailService.findAllByOrderOrderId(idOrder1);
        Iterable<OrderDetail> orderDetails2 = orderDetailService.findAllByOrderOrderId(idOrder2);

        for (OrderDetail o : orderDetails1) {
            OrderDetail od1 = new OrderDetail();
            od1.setAmount(o.getAmount());
            od1.setProductPrice(o.getProductPrice());
            od1.setStatus(o.isStatus());
            od1.setProduct(o.getProduct());
            Optional<OrderDetail> orderD = orderDetailService.findByOrderOrderIdAndProductProductId(idOrder2, od1.getProduct().getProductId());
            if (orderD.isPresent()) {
                orderD.get().setAmount(orderD.get().getAmount() + od1.getAmount());
                orderD.get().setProductPrice(orderD.get().getProductPrice() + od1.getProductPrice());
                orderDetailService.save(orderD.get());
            }else{
                od1.setOrder(orderOptional2.get());
                orderDetailService.save(od1);
            }
            orderDetailService.remove(o.getOrderDetailId());
        }
        Optional<Desk> desk = deskService.findById(id1);
        desk.get().setCustom(false);
        deskService.save(desk.get());
        orderService.remove(idOrder1);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllDeskSplit/{id}")
    public ResponseEntity<Iterable<Desk>> listDeskSplit(@PathVariable Long id) {
        return new ResponseEntity<>(deskService.findAllDeskSplit(id), HttpStatus.OK);
    }

    @PostMapping("/splitOrderDetail")
    public ResponseEntity<OrderDetail> splitOrderDetail(@RequestBody OrderDetail orderDetail){
        return new ResponseEntity<>(orderDetailService.save(orderDetail), HttpStatus.CREATED);
    }

    @PutMapping("/deskSplitOrder")
    public ResponseEntity   deskSplitOrder(@RequestParam Long id1, Long id2) {
        Optional<Order> orderOptional = orderService.findById(id1);
            Desk desk = deskService.findById(id2).get();
            desk.setCustom(true);
            deskService.save(desk);
            orderOptional.get().setDesk(desk);
            return new ResponseEntity<>(orderService.save(orderOptional.get()), HttpStatus.OK);
    }
}



