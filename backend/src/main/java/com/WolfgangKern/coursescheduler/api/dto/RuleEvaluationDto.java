package com.wolfgangkern.coursescheduler.api.dto;

/**
 * Explains how one configured rule affected a generated schedule.
 *
 * @param type built-in rule identifier
 * @param mode HARD or PREFERENCE
 * @param satisfied whether the configured threshold was satisfied
 * @param violation unweighted size of the violation
 * @param penalty weighted score contribution
 * @param explanation concise result explanation
 */
public record RuleEvaluationDto(
    String type,
    String mode,
    boolean satisfied,
    double violation,
    double penalty,
    String explanation
) {}
