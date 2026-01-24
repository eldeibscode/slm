package com.slm.backend.dto.feature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureSectionSettingDto {
    private Long id;
    private String sectionTitle;
    private String sectionDescription;
}
