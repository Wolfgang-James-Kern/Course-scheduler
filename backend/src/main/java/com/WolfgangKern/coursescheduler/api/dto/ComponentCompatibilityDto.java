package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Restricts which sections from two components may be selected together.
 *
 * @param firstComponent first component type
 * @param secondComponent second component type
 * @param allowedPairs allowed section pairs
 */
public record ComponentCompatibilityDto(
    @NotBlank(message = "First compatibility component is required.")
    @Pattern(regexp = "(?i)LEC|TUT|LAB", message = "First compatibility component must be LEC, TUT, or LAB.")
    String firstComponent,
    @NotBlank(message = "Second compatibility component is required.")
    @Pattern(regexp = "(?i)LEC|TUT|LAB", message = "Second compatibility component must be LEC, TUT, or LAB.")
    String secondComponent,
    @Size(max = 2500, message = "A compatibility rule can contain at most 2500 section pairs.")
    List<@Valid SectionPairDto> allowedPairs
) {}
