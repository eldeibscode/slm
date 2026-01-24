package com.slm.backend.dto.feature;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeatureRequest {

    @Size(max = 50, message = "Icon must be at most 50 characters")
    private String icon;

    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;

    private String description;

    private Integer displayOrder;

    @Builder.Default
    private String status = "draft";
}
