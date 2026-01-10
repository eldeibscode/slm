package com.slm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "heroes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hero extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subtitle;

    @Column(nullable = false, length = 100)
    private String badge;

    @Column(nullable = false, length = 500)
    private String socialProof;

    @Builder.Default
    @Column(nullable = false, name = "display_order")
    private Integer displayOrder = 0;

    // Optional CTA fields
    @Column(length = 100)
    private String primaryCtaLabel;

    @Column(length = 500)
    private String primaryCtaHref;

    @Column(length = 100)
    private String secondaryCtaLabel;

    @Column(length = 500)
    private String secondaryCtaHref;

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
