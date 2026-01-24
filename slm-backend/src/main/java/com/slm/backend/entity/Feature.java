package com.slm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feature extends BaseEntity {

    @Column(length = 50)
    private String icon;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Custom display order - null means use default date-based ordering
    // Lower numbers appear first, null values appear last
    @Column(name = "display_order")
    private Integer displayOrder;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.DRAFT;

    public enum Status {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}
