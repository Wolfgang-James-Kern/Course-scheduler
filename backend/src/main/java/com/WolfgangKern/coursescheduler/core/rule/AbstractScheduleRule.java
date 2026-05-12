package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Centralizes hard-requirement and preference scoring behavior for rule strategies.
 */
public abstract class AbstractScheduleRule implements ScheduleRule {
    private final RuleType type;
    private final RuleMode mode;
    private final int importance;

    /**
     * Creates a configured rule strategy.
     *
     * @param type built-in rule type
     * @param mode hard requirement or preference
     * @param importance preference weight
     */
    protected AbstractScheduleRule(RuleType type, RuleMode mode, int importance) {
        this.type = type;
        this.mode = mode;
        this.importance = importance;
    }

    /**
     * Creates the final result from a non-negative violation amount.
     *
     * @param violation size of the violation
     * @param satisfiedExplanation explanation used when satisfied
     * @param violatedExplanation explanation used when violated
     * @return completed rule result
     */
    protected RuleEvaluation result(int violation, String satisfiedExplanation, String violatedExplanation) {
        int normalizedViolation = Math.max(0, violation);
        boolean satisfied = normalizedViolation == 0;
        double penalty = mode == RuleMode.PREFERENCE ? normalizedViolation * (double) importance : 0;
        return new RuleEvaluation(
            type,
            mode,
            satisfied,
            normalizedViolation,
            penalty,
            satisfied ? satisfiedExplanation : violatedExplanation
        );
    }
}
