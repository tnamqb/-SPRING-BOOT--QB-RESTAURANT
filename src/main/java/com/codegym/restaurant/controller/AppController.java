package com.codegym.restaurant.controller;

import com.codegym.restaurant.model.Category;
import com.codegym.restaurant.model.Product;
import com.codegym.restaurant.model.Voucher;
import com.codegym.restaurant.service.category.ICategoryService;
import com.codegym.restaurant.service.product.IProductService;
import com.codegym.restaurant.service.voucher.IVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/app")
public class AppController {

    @Autowired
    private IProductService productService;

    @Autowired
    private IVoucherService voucherService;

    @Autowired
    private ICategoryService categoryService;

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
    public ResponseEntity<Iterable<Product>> allProductResponseEntity(@PathVariable Long id){
        Iterable<Product> products = productService.findAllByCategoryCategory_id(id);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
