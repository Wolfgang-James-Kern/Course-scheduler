package com.wolfgangkern.coursescheduler.core.rule;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import com.wolfgangkern.coursescheduler.core.model.AttendanceRequirement;
import com.wolfgangkern.coursescheduler.core.model.ComponentType;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.service.ScheduleAnalyzer;

/**
 * Verifies the penalty calculation for every rule in the built-in catalog.
 */
class BuiltInRuleTest {
    /**
     * Verifies that daily class duration is used instead of meeting count.
     */
    @Test
    void balancesScheduledMinutesRatherThanMeetingCounts() {
        ScheduleContext context = weeklyContext(List.of(
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0)),
                new Meeting(DayOfWeek.TUESDAY, LocalTime.of(9, 0), LocalTime.of(10, 0))
        ));

        RuleEvaluation evaluation = new BalanceWorkloadRule(RuleMode.PREFERENCE, 1, 60).evaluate(context);

        assertFalse(evaluation.satisfied());
        assertEquals(60, evaluation.penalty());
    }

    /**
     * Guards against catalog drift leaving a built-in rule untested.
     */
    @Test
    void coversEveryBuiltInRuleType() {
        Set<RuleType> covered = ruleScenarios()
            .map(arguments -> ((RuleConfiguration) arguments.get()[0]).type())
            .collect(Collectors.toCollection(() -> EnumSet.noneOf(RuleType.class)));
        assertEquals(EnumSet.allOf(RuleType.class), covered);
        assertEquals(RuleType.values().length, covered.size());
    }

    /**
     * Evaluates each built-in preference strategy against a known schedule.
     *
     * @param configuration rule configuration
     * @param expectedPenalty expected weighted penalty
     * @param context analyzed schedule for the scenario
     */
    @ParameterizedTest
    @MethodSource("ruleScenarios")
    void calculatesExpectedPreferencePenalty(
        RuleConfiguration configuration,
        int expectedPenalty,
        ScheduleContext context
    ) {
        RuleEvaluation evaluation = new ScheduleRuleFactory().create(configuration).evaluate(context);

        assertFalse(evaluation.satisfied());
        assertEquals(expectedPenalty, evaluation.penalty());
    }

    /**
     * Supplies one deterministic scenario for every built-in strategy.
     *
     * @return rule scenarios
     */
    private static Stream<Arguments> ruleScenarios() {
        ScheduleContext standard = weeklyContext(List.of(
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(8, 0), LocalTime.of(9, 0)),
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(10, 0)),
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(12, 0), LocalTime.of(13, 0)),
                new Meeting(DayOfWeek.WEDNESDAY, LocalTime.of(10, 0), LocalTime.of(11, 0))
        ));
        ScheduleContext occasionalEdges = context(List.of(
            selected("TEST 1000", ComponentType.LEC, MeetingFrequency.WEEKLY, List.of(
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(10, 0)),
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(12, 0), LocalTime.of(13, 0))
            )),
            selected("TEST 1000", ComponentType.LAB, MeetingFrequency.OCCASIONAL, List.of(
                new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 30), LocalTime.of(11, 30))
            ))
        ));
        return Stream.of(
            Arguments.of(configuration(RuleType.EARLIEST_START, LocalTime.of(9, 0), null, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.LATEST_END, LocalTime.of(11, 0), null, null, List.of(), null, null, null), 240, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_GAP, null, 60, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_MEETINGS_PER_DAY, null, null, 1, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_CONTINUOUS_BLOCK, null, 90, null, List.of(), null, null, null), 60, standard),
            Arguments.of(configuration(RuleType.MINIMUM_DAY_LENGTH, null, 120, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_DAILY_SPAN, null, 240, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.AVOID_SINGLE_MEETING_DAYS, null, null, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(
                RuleType.BLOCKED_TIME,
                null,
                null,
                null,
                List.of(),
                DayOfWeek.MONDAY,
                LocalTime.of(8, 30),
                LocalTime.of(9, 30)
            ), 120, standard),
            Arguments.of(configuration(RuleType.DAYS_OFF, null, null, null, List.of(DayOfWeek.MONDAY), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_CAMPUS_DAYS, null, null, 1, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.MAXIMUM_WEEKLY_GAP, null, 60, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.BALANCE_WORKLOAD, null, 60, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.CLUSTER_CAMPUS_DAYS, null, null, null, List.of(), null, null, null), 120, standard),
            Arguments.of(configuration(RuleType.OCCASIONAL_MEETINGS_AT_DAY_EDGES, null, null, null, List.of(), null, null, null), 120, occasionalEdges)
        );
    }

    private static RuleConfiguration configuration(
        RuleType type,
        LocalTime time,
        Integer minutes,
        Integer count,
        List<DayOfWeek> days,
        DayOfWeek day,
        LocalTime startTime,
        LocalTime endTime
    ) {
        RuleSettings settings = switch (type) {
            case EARLIEST_START, LATEST_END -> new RuleSettings.TimeThreshold(time);
            case MAXIMUM_GAP, MAXIMUM_CONTINUOUS_BLOCK, MINIMUM_DAY_LENGTH, MAXIMUM_DAILY_SPAN,
                MAXIMUM_WEEKLY_GAP, BALANCE_WORKLOAD -> new RuleSettings.MinuteThreshold(minutes);
            case MAXIMUM_MEETINGS_PER_DAY, MAXIMUM_CAMPUS_DAYS -> new RuleSettings.CountThreshold(count);
            case DAYS_OFF -> new RuleSettings.SelectedDays(days);
            case BLOCKED_TIME -> new RuleSettings.BlockedPeriod(day, startTime, endTime);
            case AVOID_SINGLE_MEETING_DAYS, CLUSTER_CAMPUS_DAYS, OCCASIONAL_MEETINGS_AT_DAY_EDGES ->
                new RuleSettings.None();
        };
        return new RuleConfiguration(type, RuleMode.PREFERENCE, 2, settings);
    }

    private static ScheduleContext weeklyContext(List<Meeting> meetings) {
        return context(List.of(selected("TEST 1000", ComponentType.LEC, MeetingFrequency.WEEKLY, meetings)));
    }

    private static ScheduleContext context(List<SelectedSection> sections) {
        return new ScheduleAnalyzer().analyze(sections);
    }

    private static SelectedSection selected(
        String courseCode,
        ComponentType type,
        MeetingFrequency frequency,
        List<Meeting> meetings
    ) {
        return new SelectedSection(
            courseCode,
            type,
            AttendanceRequirement.MANDATORY,
            frequency,
            new Section(type == ComponentType.LAB ? "002" : "001", meetings)
        );
    }
}
