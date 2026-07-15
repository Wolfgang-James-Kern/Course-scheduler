package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Describes how one configured rule evaluated a generated schedule.
 *
 * @param type evaluated rule type
 * @param mode configured rule mode
 * @param satisfied whether the schedule satisfies the rule threshold
 * @param violation unweighted size of the violation
 * @param penalty weighted ranking penalty
 * @param explanation concise explanation of the result
 */
public record RuleEvaluation(
    RuleType type,
    RuleMode mode,
    boolean satisfied,
    double violation,
    double penalty,
    String explanation
) {}
