package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByInspectionId(String inspectionId);
    List<Evidence> findByProjectId(String projectId);
}
