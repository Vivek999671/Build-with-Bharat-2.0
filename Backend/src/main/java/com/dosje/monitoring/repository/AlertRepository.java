package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findByType(String type);
    List<Alert> findByIsReadFalse();
    List<Alert> findAllByOrderByCreatedAtDesc();
    List<Alert> findByProjectId(String projectId);
    long countByIsReadFalse();
}
