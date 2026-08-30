package com.dosje.monitoring.repository;

import com.dosje.monitoring.entity.CCTV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CCTVRepository extends JpaRepository<CCTV, String> {
    List<CCTV> findByStatus(String status);
    Optional<CCTV> findByProjectId(String projectId);
    long countByStatus(String status);
}
