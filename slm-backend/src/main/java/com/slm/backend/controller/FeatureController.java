package com.slm.backend.controller;

import com.slm.backend.dto.feature.*;
import com.slm.backend.service.FeatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService featureService;

    /**
     * Get all published features for public display
     * Returns only published features, ordered by displayOrder (NULLS LAST) then createdAt DESC
     */
    @GetMapping("/published")
    public ResponseEntity<List<FeatureDto>> getPublishedFeatures() {
        List<FeatureDto> features = featureService.getPublishedFeatures();
        return ResponseEntity.ok(features);
    }

    /**
     * Get all features with pagination (admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureListResponse> getAllFeatures(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String status
    ) {
        FeatureListResponse response = featureService.getAllFeatures(page, pageSize, status);
        return ResponseEntity.ok(response);
    }

    /**
     * Get feature by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeatureDto> getFeatureById(@PathVariable Long id) {
        try {
            FeatureDto feature = featureService.getFeatureById(id);
            return ResponseEntity.ok(feature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create a new feature
     * Only ADMIN role can create features
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFeature(@Valid @RequestBody CreateFeatureRequest request) {
        try {
            FeatureDto feature = featureService.createFeature(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(feature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Update an existing feature
     * Only ADMIN role can update features
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFeature(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFeatureRequest request
    ) {
        try {
            FeatureDto feature = featureService.updateFeature(id, request);
            return ResponseEntity.ok(feature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Delete a feature
     * Only ADMIN role can delete features
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeature(@PathVariable Long id) {
        try {
            featureService.deleteFeature(id);
            return ResponseEntity.ok(Map.of("message", "Feature deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ============================================================================
    // SECTION SETTINGS ENDPOINTS
    // ============================================================================

    /**
     * Get section settings (title and description)
     * Public endpoint - needed for displaying the section header
     */
    @GetMapping("/section-settings")
    public ResponseEntity<FeatureSectionSettingDto> getSectionSettings() {
        FeatureSectionSettingDto settings = featureService.getSectionSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * Update section settings
     * Only ADMIN role can update section settings
     */
    @PatchMapping("/section-settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSectionSettings(@RequestBody FeatureSectionSettingDto request) {
        try {
            FeatureSectionSettingDto settings = featureService.updateSectionSettings(request);
            return ResponseEntity.ok(settings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}
