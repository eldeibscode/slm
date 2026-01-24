package com.slm.backend.dto.feature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureListResponse {
    private List<FeatureDto> features;
    private long total;
    private int page;
    private int pageSize;
    private int totalPages;
}
