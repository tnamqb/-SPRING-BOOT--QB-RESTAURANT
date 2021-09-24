package com.codegym.restaurant.controller;


import com.codegym.restaurant.model.Desk;
import com.codegym.restaurant.service.desk.DeskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Optional;

@RestController
public class DeskController {

    private static String viewMode;

    @Autowired
    private DeskService deskService;

    @GetMapping("/desk")
    public ModelAndView listProduct() {
        return new ModelAndView("/dashboard/desk");
    }

    @GetMapping("/allDesk")
    public ResponseEntity<Iterable<Desk>> listAllDesk(){
        return new ResponseEntity<>(deskService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/createDesk")
    public ResponseEntity<Desk> createDesk(@RequestBody Desk desk){
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
}
