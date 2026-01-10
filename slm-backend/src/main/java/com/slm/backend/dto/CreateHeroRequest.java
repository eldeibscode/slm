package com.slm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHeroRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Subtitle is required")
    private String subtitle;

    @NotBlank(message = "Badge is required")
    @Size(max = 100)
    private String badge;

    @NotBlank(message = "Social proof is required")
    @Size(max = 500)
    private String socialProof;

    private Integer displayOrder = 0;

    @Size(max = 100)
    private String primaryCtaLabel;

    @Size(max = 500)
    private String primaryCtaHref;

    @Size(max = 100)
    private String secondaryCtaLabel;

    @Size(max = 500)
    private String secondaryCtaHref;

    private String status = "draft";
}
