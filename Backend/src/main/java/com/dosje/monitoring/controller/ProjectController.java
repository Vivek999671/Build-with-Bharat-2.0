package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.entity.Project;
import com.dosje.monitoring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects(
            @RequestParam(required = false, defaultValue = "All") String filter) {
        List<Project> projects = projectService.getAllProjects(filter);
        return ResponseEntity.ok(ApiResponse.ok(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable String id) {
        return projectService.getProjectById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.ok(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        Project created = projectService.saveProject(project);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable String id, @RequestBody Project project) {
        try {
            Project updated = projectService.updateProject(id, project);
            return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
