package com.wolfgangkern.coursescheduler.core.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

import org.springframework.stereotype.Service;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleContext;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleEvaluation;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRule;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRuleFactory;

/**
 * Coordinates schedule generation, analysis, rule evaluation, and ranking.
 */
@Service
public final class ScheduleSolver {
    private static final Comparator<ScheduleSolution> BEST_FIRST = Comparator
        .comparingDouble(ScheduleSolution::getScore)
        .thenComparing(ScheduleSolution::getRankingKey);

    private final ScheduleGenerator generator;
    private final ScheduleAnalyzer analyzer;
    private final ScheduleEvaluator evaluator;
    private final ScheduleRuleFactory ruleFactory;

    /**
     * Creates a schedule-solving service.
     *
     * @param generator candidate generator
     * @param analyzer schedule analyzer
     * @param evaluator rule evaluator
     * @param ruleFactory built-in rule factory
     */
    public ScheduleSolver(
        ScheduleGenerator generator,
        ScheduleAnalyzer analyzer,
        ScheduleEvaluator evaluator,
        ScheduleRuleFactory ruleFactory
    ) {
        this.generator = generator;
        this.analyzer = analyzer;
        this.evaluator = evaluator;
        this.ruleFactory = ruleFactory;
    }

    /**
     * Solves schedules using configured built-in rules.
     *
     * @param courses requested courses
     * @param configurations rule configurations
     * @param topN maximum result count
     * @return ranked eligible schedules
     */
    public List<ScheduleSolution> solve(
        List<Course> courses,
        List<RuleConfiguration> configurations,
        int topN
    ) {
        if (courses == null || courses.isEmpty() || topN <= 0) {
            return List.of();
        }

        List<ScheduleRule> rules = configurations == null
            ? List.of()
            : configurations.stream().map(ruleFactory::create).toList();
        PriorityQueue<ScheduleSolution> bestSolutions = new PriorityQueue<>(BEST_FIRST.reversed());

        generator.generate(courses, sections -> consider(sections, rules, topN, bestSolutions));

        List<ScheduleSolution> results = new ArrayList<>(bestSolutions);
        results.sort(BEST_FIRST);
        return results;
    }

    /**
     * Evaluates one generated schedule and retains it when it belongs in the top results.
     *
     * @param sections selected sections
     * @param rules configured strategies
     * @param topN maximum result count
     * @param bestSolutions retained result heap
     */
    private void consider(
        List<SelectedSection> sections,
        List<ScheduleRule> rules,
        int topN,
        PriorityQueue<ScheduleSolution> bestSolutions
    ) {
        ScheduleAnalysis analysis = analyzer.analyzeBoth(sections);
        ScheduleEvaluation evaluation = evaluator.evaluate(analysis.regularWeek(), analysis.fullWeek(), rules);
        if (!evaluation.eligible()) {
            return;
        }

        ScheduleSolution solution = new ScheduleSolution(
            sections,
            analysis.fullWeek().getStats(),
            evaluation.score(),
            evaluation.rules()
        );
        if (bestSolutions.size() < topN) {
            bestSolutions.offer(solution);
            return;
        }
        if (BEST_FIRST.compare(solution, bestSolutions.peek()) < 0) {
            bestSolutions.poll();
            bestSolutions.offer(solution);
        }
    }

}
