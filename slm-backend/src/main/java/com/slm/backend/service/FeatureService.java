package com.slm.backend.service;

import com.slm.backend.dto.feature.*;
import com.slm.backend.entity.Feature;
import com.slm.backend.entity.FeatureSectionSetting;
import com.slm.backend.repository.FeatureRepository;
import com.slm.backend.repository.FeatureSectionSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeatureService {

    private final FeatureRepository featureRepository;
    private final FeatureSectionSettingRepository sectionSettingRepository;

    @Transactional(readOnly = true)
    public List<FeatureDto> getPublishedFeatures() {
        List<Feature> features = featureRepository.findPublishedOrdered(Feature.Status.PUBLISHED);
        return features.stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeatureListResponse getAllFeatures(Integer page, Integer pageSize, String status) {
        int pageNum = page != null ? page : 0;
        int size = pageSize != null && pageSize > 0 ? pageSize : 10;

        List<Feature> allFeatures = featureRepository.findAllOrdered();

        // Filter by status if provided
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            try {
                Feature.Status featureStatus = Feature.Status.valueOf(status.toUpperCase());
                allFeatures = allFeatures.stream()
                    .filter(f -> f.getStatus() == featureStatus)
                    .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                // Invalid status, ignore filter
            }
        }

        // Manual pagination
        int total = allFeatures.size();
        int start = pageNum * size;
        int end = Math.min(start + size, total);

        List<FeatureDto> features = allFeatures.stream()
            .skip(start)
            .limit(size)
            .map(this::mapToDto)
            .collect(Collectors.toList());

        return FeatureListResponse.builder()
            .features(features)
            .total(total)
            .page(pageNum)
            .pageSize(size)
            .totalPages((int) Math.ceil((double) total / size))
            .build();
    }

    @Transactional(readOnly = true)
    public FeatureDto getFeatureById(Long id) {
        Feature feature = featureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Feature not found with id: " + id));
        return mapToDto(feature);
    }

    @Transactional
    public FeatureDto createFeature(CreateFeatureRequest request) {
        Feature feature = Feature.builder()
            .icon(request.getIcon())
            .title(request.getTitle())
            .description(request.getDescription())
            .displayOrder(request.getDisplayOrder())
            .status(parseStatus(request.getStatus()))
            .build();

        feature = featureRepository.save(feature);
        return mapToDto(feature);
    }

    @Transactional
    public FeatureDto updateFeature(Long id, UpdateFeatureRequest request) {
        Feature feature = featureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Feature not found with id: " + id));

        if (request.getIcon() != null) {
            feature.setIcon(request.getIcon());
        }

        if (request.getTitle() != null) {
            feature.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            feature.setDescription(request.getDescription());
        }

        if (request.getStatus() != null) {
            feature.setStatus(parseStatus(request.getStatus()));
        }

        // Handle displayOrder - allow setting to null by checking if the field was provided
        if (request.getDisplayOrder() != null) {
            // Value of 0 or less clears the display order
            if (request.getDisplayOrder() <= 0) {
                feature.setDisplayOrder(null);
            } else {
                feature.setDisplayOrder(request.getDisplayOrder());
            }
        }

        feature = featureRepository.save(feature);
        return mapToDto(feature);
    }

    @Transactional
    public void deleteFeature(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new IllegalArgumentException("Feature not found with id: " + id);
        }
        featureRepository.deleteById(id);
    }

    private Feature.Status parseStatus(String status) {
        if (status == null || status.isEmpty()) {
            return Feature.Status.DRAFT;
        }
        try {
            return Feature.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Feature.Status.DRAFT;
        }
    }

    private FeatureDto mapToDto(Feature feature) {
        return FeatureDto.builder()
            .id(feature.getId())
            .icon(feature.getIcon())
            .title(feature.getTitle())
            .description(feature.getDescription())
            .displayOrder(feature.getDisplayOrder())
            .status(feature.getStatus().name().toLowerCase())
            .createdAt(feature.getCreatedAt())
            .updatedAt(feature.getUpdatedAt())
            .build();
    }

    // ============================================================================
    // SECTION SETTINGS
    // ============================================================================

    @Transactional(readOnly = true)
    public FeatureSectionSettingDto getSectionSettings() {
        FeatureSectionSetting setting = sectionSettingRepository.findFirstByOrderByIdAsc()
            .orElse(null);

        if (setting == null) {
            // Return default values if no settings exist
            return FeatureSectionSettingDto.builder()
                .sectionTitle("Everything you need to think smarter")
                .sectionDescription("Powerful features designed to help you make better decisions faster. Built for teams of all sizes.")
                .build();
        }

        return mapSectionSettingToDto(setting);
    }

    @Transactional
    public FeatureSectionSettingDto updateSectionSettings(FeatureSectionSettingDto request) {
        FeatureSectionSetting setting = sectionSettingRepository.findFirstByOrderByIdAsc()
            .orElse(new FeatureSectionSetting());

        if (request.getSectionTitle() != null) {
            setting.setSectionTitle(request.getSectionTitle());
        }

        if (request.getSectionDescription() != null) {
            setting.setSectionDescription(request.getSectionDescription());
        }

        setting = sectionSettingRepository.save(setting);
        return mapSectionSettingToDto(setting);
    }

    private FeatureSectionSettingDto mapSectionSettingToDto(FeatureSectionSetting setting) {
        return FeatureSectionSettingDto.builder()
            .id(setting.getId())
            .sectionTitle(setting.getSectionTitle())
            .sectionDescription(setting.getSectionDescription())
            .build();
    }
}
