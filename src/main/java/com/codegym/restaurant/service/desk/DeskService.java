package com.codegym.restaurant.service.desk;

import com.codegym.restaurant.model.Desk;
import com.codegym.restaurant.repository.IDeskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeskService implements  IDeskService{
    @Autowired
    private IDeskRepository deskRepository;

    @Override
    public Iterable<Desk> findAll() {
        return deskRepository.findAll();
    }

    @Override
    public Optional<Desk> findById(Long id) {
        return deskRepository.findById(id);
    }

    public Optional<Desk> findByName(String name) {
        return deskRepository.findByTableName(name);
    }

    @Override
    public Desk save(Desk desk) {
    return  deskRepository.save(desk);
    }

    @Override
    public void remove(Long id) {
        deskRepository.deleteById(id);
    }
}
