package com.ewarranty.repository;

import com.ewarranty.entity.WarrantyCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyCardRepository extends JpaRepository<WarrantyCard, Long> {
    Optional<WarrantyCard> findByCertificateNo(String certificateNo);
    List<WarrantyCard> findByUserIdOrderByIssuedAtDesc(Long userId);
    List<WarrantyCard> findAllByOrderByIssuedAtDesc();
}
