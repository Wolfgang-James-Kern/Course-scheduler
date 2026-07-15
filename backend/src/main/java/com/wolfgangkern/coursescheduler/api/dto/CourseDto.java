package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Represents a requested course and its components.
 *
 * @param code course code
 * @param components requested course components
 * @param compatibilities allowed cross-component section pairs
 */
public record CourseDto(
    @NotBlank(message = "Course code is required.")
    @Size(max = 40, message = "Course code cannot exceed 40 characters.")
    String code,
    @NotEmpty(message = "Each course must contain at least one component.")
    @Size(max = 3, message = "A course can contain at most three components.")
    List<@Valid CourseComponentDto> components,
    @Size(max = 3, message = "A course can contain at most three compatibility rules.")
    List<@Valid ComponentCompatibilityDto> compatibilities
) {}
