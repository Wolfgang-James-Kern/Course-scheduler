package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Contains the courses, rules, and result limit for schedule generation.
 *
 * @param courses requested courses
 * @param rules configured built-in rules
 * @param topN maximum result count
 */
public record SolveRequest(
    @NotEmpty(message = "At least one course is required.")
    @Size(max = 12, message = "A request can contain at most 12 courses.")
    List<@Valid CourseDto> courses,
    @NotNull(message = "Rules are required; use an empty list when no rules are selected.")
    @Size(max = 20, message = "A request can contain at most 20 rules.")
    List<@Valid RuleConfigurationDto> rules,
    @NotNull(message = "The requested result count is required.")
    @Min(value = 1, message = "The requested result count must be at least 1.")
    @Max(value = 50, message = "The requested result count cannot exceed 50.")
    Integer topN
) {}
