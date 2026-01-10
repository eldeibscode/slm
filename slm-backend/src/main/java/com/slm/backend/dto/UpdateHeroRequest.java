package com.slm.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHeroRequest {

    @Size(max = 255)
    private String title;

    private String subtitle;

    @Size(max = 100)
    private String badge;

    @Size(max = 500)
    private String socialProof;

    private Integer displayOrder;

    @Size(max = 100)
    private String primaryCtaLabel;

    @Size(max = 500)
    private String primaryCtaHref;

    @Size(max = 100)
    private String secondaryCtaLabel;

    @Size(max = 500)
    private String secondaryCtaHref;

    private String status;
}
