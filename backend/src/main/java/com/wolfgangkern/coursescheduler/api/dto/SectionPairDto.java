package com.wolfgangkern.coursescheduler.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Identifies one allowed pair of sections from two course components.
 *
 * @param firstSectionId section from the first component
 * @param secondSectionId section from the second component
 */
public record SectionPairDto(
    @NotBlank(message = "First compatible section identifier is required.")
    @Size(max = 40, message = "Section identifier cannot exceed 40 characters.")
    String firstSectionId,
    @NotBlank(message = "Second compatible section identifier is required.")
    @Size(max = 40, message = "Section identifier cannot exceed 40 characters.")
    String secondSectionId
) {}
