package com.slm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "feature_section_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureSectionSetting extends BaseEntity {

    @Column(length = 255)
    private String sectionTitle;

    @Column(columnDefinition = "TEXT")
    private String sectionDescription;
}
