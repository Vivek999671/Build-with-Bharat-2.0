package com.dosje.monitoring.service;

import com.dosje.monitoring.entity.CCTV;
import com.dosje.monitoring.repository.CCTVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CCTVService {

    @Autowired
    private CCTVRepository cctvRepository;

    public List<CCTV> getAllCameras(String status) {
        if (status == null || status.equalsIgnoreCase("All") || status.trim().isEmpty()) {
            return cctvRepository.findAll();
        }
        return cctvRepository.findByStatus(status.toUpperCase());
    }

    public Optional<CCTV> getCameraById(String id) {
        return cctvRepository.findById(id);
    }

    public CCTV saveCamera(CCTV cctv) {
        cctv.setUpdatedAt(LocalDateTime.now());
        return cctvRepository.save(cctv);
    }
}
