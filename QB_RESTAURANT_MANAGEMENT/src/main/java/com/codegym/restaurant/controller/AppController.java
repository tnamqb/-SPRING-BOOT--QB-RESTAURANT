package com.codegym.restaurant.controller;

import com.codegym.restaurant.model.*;
import com.codegym.restaurant.service.bill.IBillService;
import com.codegym.restaurant.service.billDetail.IBillDetailService;
import com.codegym.restaurant.service.category.ICategoryService;
import com.codegym.restaurant.service.desk.IDeskService;
import com.codegym.restaurant.service.order.IOrderService;
import com.codegym.restaurant.service.orderDetail.IOrderDetailService;
import com.codegym.restaurant.service.product.IProductService;
import com.codegym.restaurant.service.voucher.IVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Optional;

@RestController
@RequestMapping("/app")
public class AppController {
    @Autowired
    private IOrderService orderService;

    @Autowired
    private IProductService productService;

    @Autowired
    private IVoucherService voucherService;

    @Autowired
    private IDeskService deskService;

    @Autowired
    private ICategoryService categoryService;

    @Autowired
    private IOrderDetailService orderDetailService;

    @Autowired
    private IBillService billService;

    @Autowired
    private IBillDetailService billDetailService;

    private String getPrincipal() {
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('STAFF')")
    public ModelAndView getAllProductPage() {
        ModelAndView modelAndView = new ModelAndView("/client/app");
        modelAndView.addObject("userInfo", getPrincipal());
        return modelAndView;
    }

    @GetMapping("getAllItem")
    public ModelAndView getAllItem(){
        ModelAndView modelAndView = new ModelAndView("/client/app");
        return modelAndView;
    }

    @GetMapping("getAllItemVoucher")
    public ModelAndView getAllItemVoucher(){
        ModelAndView modelAndView = new ModelAndView("/client/app");
        return modelAndView;
    }

    @GetMapping("/allItemVoucherIsApply")
    public ResponseEntity<Iterable<Voucher>> voucherResponseEntity(){
        Iterable<Voucher> vouchers = voucherService.findVouchersIsApply();
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
    }

    @GetMapping("/allItem")
    public ResponseEntity<Iterable<Product>> productResponseEntity(){
        Iterable<Product> products = productService.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/getAllItemCategory")
    public ModelAndView getAllItemCategory(){
        ModelAndView modelAndView = new ModelAndView("/client/app");
        return modelAndView;
    }

    @GetMapping("/allItemCategory")
    public ResponseEntity<Iterable<Category>> allItemCategory(){
        return new ResponseEntity<>(categoryService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/allProductByCategory/{id}")
    public ResponseEntity<Iterable<Product>> allProductResponseEntity(@PathVariable Long id) {
        Iterable<Product> products = productService.findAllByCategoryCategoryId(id);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/createOrder")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return new ResponseEntity<>(orderService.save(order), HttpStatus.CREATED);
    }

    @GetMapping("/getOrder/{id}")
    public ResponseEntity<Order> getOrderByIdTable(@PathVariable Long id) {
        return new ResponseEntity<>(orderService.findByTableId(id).get(), HttpStatus.OK);
    }

    @PostMapping("/createOrderDetail")
    public ResponseEntity<OrderDetail> createOrderDetail(@RequestBody OrderDetail orderDetail){
        Optional<OrderDetail> orderDetailOptional = orderDetailService.findByOrderOrderIdAndProductProductId(orderDetail.getOrder().getOrderId(),orderDetail.getProduct().getProductId());
        if (orderDetailOptional.isPresent()){
            long id = orderDetailOptional.get().getOrderDetailId();
            orderDetail.setOrderDetailId(id);
            int amount = orderDetailOptional.get().getAmount() +1;
            orderDetail.setAmount(amount);

            double price = orderDetail.getProductPrice();
            orderDetail.setProductPrice(orderDetailOptional.get().getProductPrice()+price);

            orderDetail.setStatus(false);
            return new ResponseEntity<>(orderDetailService.save(orderDetail), HttpStatus.OK);
        }
        orderDetail.setAmount(1);
        orderDetail.setStatus(false);
        return new ResponseEntity<>(orderDetailService.save(orderDetail), HttpStatus.CREATED);
    }

    @GetMapping("/getOrderDetailByOrderID/{id}")
    public ResponseEntity<Iterable<OrderDetail>> getAllOrderDetail(@PathVariable Long id){
        Iterable<OrderDetail> orderDetails = orderDetailService.findAllByOrderOrderId(id);
        if (orderDetails.spliterator().getExactSizeIfKnown()>0){
            return new ResponseEntity<>(orderDetails, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteOrderDetail/{id}")
    public ResponseEntity<OrderDetail> deleteOrderDetail(@PathVariable Long id) {
        Optional<OrderDetail> orderDetailOptional = orderDetailService.findById(id);
        if (!orderDetailOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        orderDetailService.remove(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/increaseProduct/{id}")
    public ResponseEntity<OrderDetail> increaseProduct(@PathVariable Long id) {
        Optional<OrderDetail> orderDetailOptional = orderDetailService.findById(id);
//        tính giá trị trung bình để lấy ra đơn giá cho sản phẩm
        double price = (orderDetailOptional.get().getProductPrice())/(orderDetailOptional.get().getAmount());

        int amount = orderDetailOptional.get().getAmount()+1;
        orderDetailOptional.get().setAmount(amount);
        orderDetailOptional.get().setProductPrice(amount*price);
        return new ResponseEntity<>(orderDetailService.save(orderDetailOptional.get()),HttpStatus.OK);
    }

    @PutMapping("/reduceProduct/{id}")
    public ResponseEntity<OrderDetail> reduceProduct(@PathVariable Long id) {
        Optional<OrderDetail> orderDetailOptional = orderDetailService.findById(id);
        double price = (orderDetailOptional.get().getProductPrice())/(orderDetailOptional.get().getAmount());

        double totalPrice = orderDetailOptional.get().getProductPrice();

        int amount = orderDetailOptional.get().getAmount();
        if (amount>1){
            orderDetailOptional.get().setAmount(amount-1);
            orderDetailOptional.get().setProductPrice(totalPrice-price);
            return new ResponseEntity<>(orderDetailService.save(orderDetailOptional.get()),HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/createBill")
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        bill.setBillNote("Đã thanh toán");
        return new ResponseEntity<>(billService.save(bill), HttpStatus.CREATED);
    }

    @PostMapping("/createBillDetail/{id}")
    public ResponseEntity<BillDetail> createBillDetail(@RequestBody BillDetail billDetail, @PathVariable Long id) {
        billDetailService.save(billDetail);
        Desk desk = deskService.findById(id).get();
        desk.setCustom(false);
        deskService.save(desk);
        Optional<Order> orderOptional = orderService.findByTableId(id);
        Iterable<OrderDetail> orderDetails = orderDetailService.findAllByOrderOrderId(orderOptional.get().getOrderId());
        for (OrderDetail o : orderDetails) {
            orderDetailService.remove(o.getOrderDetailId());
        }
        orderService.remove(orderOptional.get().getOrderId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
