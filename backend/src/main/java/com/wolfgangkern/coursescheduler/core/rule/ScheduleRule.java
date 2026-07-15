package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Strategy for evaluating one built-in scheduling rule.
 */
public interface ScheduleRule {
    /**
     * Evaluates a schedule against this rule.
     *
     * @param context analyzed schedule data
     * @return rule result
     */
    RuleEvaluation evaluate(ScheduleContext context);
}
