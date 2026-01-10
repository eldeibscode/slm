package com.slm.backend.dto;

import com.slm.backend.entity.Hero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroDto {
    private Long id;
    private String title;
    private String subtitle;
    private String badge;
    private String socialProof;
    private Integer displayOrder;
    private String primaryCtaLabel;
    private String primaryCtaHref;
    private String secondaryCtaLabel;
    private String secondaryCtaHref;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static HeroDto fromEntity(Hero hero) {
        return HeroDto.builder()
                .id(hero.getId())
                .title(hero.getTitle())
                .subtitle(hero.getSubtitle())
                .badge(hero.getBadge())
                .socialProof(hero.getSocialProof())
                .displayOrder(hero.getDisplayOrder())
                .primaryCtaLabel(hero.getPrimaryCtaLabel())
                .primaryCtaHref(hero.getPrimaryCtaHref())
                .secondaryCtaLabel(hero.getSecondaryCtaLabel())
                .secondaryCtaHref(hero.getSecondaryCtaHref())
                .status(hero.getStatus().name().toLowerCase())
                .createdAt(hero.getCreatedAt())
                .updatedAt(hero.getUpdatedAt())
                .build();
    }
}
