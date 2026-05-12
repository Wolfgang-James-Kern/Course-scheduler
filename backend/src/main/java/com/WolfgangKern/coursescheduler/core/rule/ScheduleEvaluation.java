package com.wolfgangkern.coursescheduler.core.rule;

import java.util.List;

/**
 * Aggregates all rule results for a generated schedule.
 *
 * @param eligible whether every hard requirement was satisfied
 * @param score total weighted preference penalty
 * @param rules individual rule results
 */
public record ScheduleEvaluation(boolean eligible, double score, List<RuleEvaluation> rules) {
    /**
     * Protects the evaluation result from later list mutation.
     */
    public ScheduleEvaluation {
        rules = List.copyOf(rules);
    }
}
