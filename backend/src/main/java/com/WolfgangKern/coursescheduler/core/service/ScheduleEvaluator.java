package com.wolfgangkern.coursescheduler.core.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.rule.RuleEvaluation;
import com.wolfgangkern.coursescheduler.core.rule.RuleMode;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleContext;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleEvaluation;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRule;

/**
 * Combines independent rule strategies into one schedule evaluation.
 */
@Component
public final class ScheduleEvaluator {
    /** Weight for two regular weeks in a three-week expected-value cycle. */
    private static final double REGULAR_WEEK_WEIGHT = 2.0 / 3.0;

    /** Weight for one occasional week in a three-week expected-value cycle. */
    private static final double OCCASIONAL_WEEK_WEIGHT = 1.0 / 3.0;

    /**
     * Evaluates all configured rules.
     *
     * @param regularContext schedule without occasional meetings
     * @param fullContext schedule including occasional meetings
     * @param rules configured rule strategies
     * @return combined eligibility and score
     */
    public ScheduleEvaluation evaluate(
        ScheduleContext regularContext,
        ScheduleContext fullContext,
        List<ScheduleRule> rules
    ) {
        List<RuleEvaluation> results = new ArrayList<>();
        boolean eligible = true;
        double score = 0;

        for (ScheduleRule rule : rules) {
            RuleEvaluation regularResult = rule.evaluate(regularContext);
            RuleEvaluation fullResult = rule.evaluate(fullContext);
            RuleEvaluation result = combine(regularResult, fullResult);
            results.add(result);
            if (result.mode() == RuleMode.HARD && !result.satisfied()) {
                eligible = false;
            }
            score += result.penalty();
        }
        return new ScheduleEvaluation(eligible, score, results);
    }

    /**
     * Combines regular-week and occasional-week rule results.
     *
     * @param regularResult regular-week result
     * @param fullResult occasional-week result
     * @return frequency-aware rule result
     */
    private RuleEvaluation combine(RuleEvaluation regularResult, RuleEvaluation fullResult) {
        boolean satisfied = regularResult.satisfied() && fullResult.satisfied();
        if (regularResult.mode() == RuleMode.HARD) {
            RuleEvaluation explanationSource = regularResult.violation() >= fullResult.violation()
                ? regularResult
                : fullResult;
            return new RuleEvaluation(
                regularResult.type(),
                regularResult.mode(),
                satisfied,
                Math.max(regularResult.violation(), fullResult.violation()),
                0,
                satisfied ? fullResult.explanation() : explanationSource.explanation()
            );
        }
        double violation = weightedAverage(regularResult.violation(), fullResult.violation());
        double penalty = weightedAverage(regularResult.penalty(), fullResult.penalty());
        RuleEvaluation explanationSource = regularResult.violation() >= fullResult.violation()
            ? regularResult
            : fullResult;
        String explanation = regularResult.violation() == fullResult.violation()
            ? fullResult.explanation()
            : explanationSource.explanation() + " Occasional meetings are weighted at one third.";
        return new RuleEvaluation(
            regularResult.type(),
            regularResult.mode(),
            satisfied,
            violation,
            penalty,
            explanation
        );
    }

    /**
     * Calculates an expected value for two regular weeks and one occasional week.
     *
     * @param regularValue regular-week value
     * @param occasionalValue occasional-week value
     * @return frequency-weighted value
     */
    private double weightedAverage(double regularValue, double occasionalValue) {
        return regularValue * REGULAR_WEEK_WEIGHT + occasionalValue * OCCASIONAL_WEEK_WEIGHT;
    }
}
