package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByInspectionId(String inspectionId);
    List<Attendance> findByProjectId(String projectId);
    List<Attendance> findByAnomalyDetectedTrue();
}
