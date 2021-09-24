package com.codegym.restaurant.service.desk;

import com.codegym.restaurant.model.Desk;
import com.codegym.restaurant.service.IGeneralService;
import org.springframework.data.repository.query.Param;

public interface IDeskService extends IGeneralService<Desk> {
    Iterable<Desk> findAllByCustomIsTrue(Long id);

    Iterable<Desk> findAllDeskSplit(@Param("id") Long id);

}
