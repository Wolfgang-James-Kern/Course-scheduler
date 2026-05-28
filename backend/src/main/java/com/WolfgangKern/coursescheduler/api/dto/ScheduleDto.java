package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

/**
 * Represents one ranked schedule and its evaluation details.
 *
 * @param sections selected sections
 * @param stats schedule statistics
 * @param score weighted preference score
 * @param ruleEvaluations individual rule results
 */
public record ScheduleDto(
    List<SectionDto> sections,
    StatsDto stats,
    double score,
    List<RuleEvaluationDto> ruleEvaluations
) {}
