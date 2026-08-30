package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, String> {
    List<Inspection> findByStatus(String status);
    List<Inspection> findByInspectorId(String inspectorId);
    List<Inspection> findByProjectId(String projectId);
    List<Inspection> findByStatusOrderByScheduledDateDesc(String status);
    long countByStatus(String status);
}
