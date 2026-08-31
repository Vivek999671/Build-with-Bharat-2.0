package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {
    List<Report> findByScheme(String scheme);
    List<Report> findByDistrict(String district);
    List<Report> findAllByOrderByGeneratedAtDesc();
}
