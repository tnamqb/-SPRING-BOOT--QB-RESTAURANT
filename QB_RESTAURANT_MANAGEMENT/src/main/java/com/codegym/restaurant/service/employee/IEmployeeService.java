package com.codegym.restaurant.service.employee;


import com.codegym.restaurant.model.Employee;
import com.codegym.restaurant.security.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface IEmployeeService extends UserDetailsService {
    Iterable<Employee> findAll();
    Employee createUser(Employee employee);

    Optional<Employee> findEmployeeByPhone(String phoneNumber);

    UserPrincipal findByUsername(String username);

    boolean isContainUsername(String username);

    boolean isContainPhone(String phone);
}
