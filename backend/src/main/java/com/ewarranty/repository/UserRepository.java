package com.ewarranty.repository;

import com.ewarranty.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmailAndRole(String email, String role);
    java.util.List<User> findByRoleOrderByIdDesc(String role);
    java.util.List<User> findByRole(String role);
}
