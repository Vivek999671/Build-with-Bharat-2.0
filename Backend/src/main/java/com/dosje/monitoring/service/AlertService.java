package com.dosje.monitoring.service;

import com.dosje.monitoring.entity.Alert;
import com.dosje.monitoring.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAllAlerts(String type) {
        if (type == null || type.equalsIgnoreCase("All") || type.trim().isEmpty()) {
            return alertRepository.findAllByOrderByCreatedAtDesc();
        }
        return alertRepository.findByType(type.toUpperCase());
    }

    public Alert markAsRead(String id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found: " + id));
        alert.setIsRead(true);
        return alertRepository.save(alert);
    }

    public Alert createAlert(Alert alert) {
        if (alert.getId() == null || alert.getId().isEmpty()) {
            alert.setId("ALT-" + (900 + alertRepository.count() + 1));
        }
        return alertRepository.save(alert);
    }
}
