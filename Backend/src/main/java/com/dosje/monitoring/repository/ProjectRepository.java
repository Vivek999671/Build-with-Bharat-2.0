package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByStatus(String status);
    List<Project> findByRiskLevel(String riskLevel);
    List<Project> findByDistrict(String district);
    List<Project> findByScheme(String scheme);

    @Query("SELECT p FROM Project p WHERE p.riskScore >= 70 ORDER BY p.riskScore DESC")
    List<Project> findHighRiskProjects();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.cctvStatus = 'ONLINE'")
    long countOnlineCCTVProjects();
}
