package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.entity.CCTV;
import com.dosje.monitoring.service.CCTVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cctv")
@CrossOrigin(origins = "*")
public class CCTVController {

    @Autowired
    private CCTVService cctvService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CCTV>>> getAllCameras(
            @RequestParam(required = false, defaultValue = "All") String status) {
        List<CCTV> list = cctvService.getAllCameras(status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CCTV>> getCameraById(@PathVariable String id) {
        return cctvService.getCameraById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.ok(c)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
