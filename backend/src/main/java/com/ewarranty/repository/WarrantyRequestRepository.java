package com.ewarranty.repository;

import com.ewarranty.entity.WarrantyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRequestRepository extends JpaRepository<WarrantyRequest, Long> {
    Optional<WarrantyRequest> findByRequestId(String requestId);
    List<WarrantyRequest> findByUserIdOrderBySubmissionDateDesc(Long userId);
    List<WarrantyRequest> findByStatusOrderBySubmissionDateDesc(String status);
    List<WarrantyRequest> findAllByOrderBySubmissionDateDesc();
    long countByStatus(String status);
}
