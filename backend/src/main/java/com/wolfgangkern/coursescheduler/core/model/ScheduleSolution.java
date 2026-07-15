package com.wolfgangkern.coursescheduler.core.model;

import java.util.List;
import java.util.stream.Collectors;

import com.wolfgangkern.coursescheduler.core.rule.RuleEvaluation;

/**
 * Represents one eligible schedule with its statistics, score, and rule breakdown.
 */
public final class ScheduleSolution {
    private final List<SelectedSection> sections;
    private final ScheduleStats stats;
    private final double score;
    private final List<RuleEvaluation> ruleEvaluations;
    private final String rankingKey;

    /**
     * Creates a schedule solution with its rule breakdown.
     *
     * @param sections selected sections
     * @param stats calculated statistics
     * @param score ranking score
     * @param ruleEvaluations individual rule results
     */
    public ScheduleSolution(
        List<SelectedSection> sections,
        ScheduleStats stats,
        double score,
        List<RuleEvaluation> ruleEvaluations
    ) {
        if (sections == null || stats == null || ruleEvaluations == null || !Double.isFinite(score) || score < 0) {
            throw new IllegalArgumentException("Schedule solution values are required and must be valid.");
        }
        this.sections = List.copyOf(sections);
        this.stats = stats;
        this.score = score;
        this.ruleEvaluations = List.copyOf(ruleEvaluations);
        this.rankingKey = this.sections.stream()
            .map(section -> section.courseCode() + ":" + section.componentType() + ":" + section.id())
            .sorted()
            .collect(Collectors.joining("|"));
    }

    /**
     * Returns the selected sections.
     *
     * @return immutable section list
     */
    public List<SelectedSection> getSections() {
        return sections;
    }

    /**
     * Returns the calculated schedule statistics.
     *
     * @return schedule statistics
     */
    public ScheduleStats getStats() {
        return stats;
    }

    /**
     * Returns the weighted preference score, where lower is better.
     *
     * @return ranking score
     */
    public double getScore() {
        return score;
    }

    /**
     * Returns the stable key used to order equally scored schedules.
     *
     * @return deterministic ranking key
     */
    public String getRankingKey() {
        return rankingKey;
    }

    /**
     * Returns the individual rule results used for ranking.
     *
     * @return immutable rule result list
     */
    public List<RuleEvaluation> getRuleEvaluations() {
        return ruleEvaluations;
    }
}
