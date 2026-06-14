package com.wolfgangkern.coursescheduler.core.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.wolfgangkern.coursescheduler.core.model.AttendanceRequirement;
import com.wolfgangkern.coursescheduler.core.model.ComponentType;
import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.CourseComponent;
import com.wolfgangkern.coursescheduler.core.model.EnrollmentRequirement;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.rule.RuleMode;
import com.wolfgangkern.coursescheduler.core.rule.RuleSettings;
import com.wolfgangkern.coursescheduler.core.rule.RuleType;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRuleFactory;
import com.wolfgangkern.coursescheduler.support.TestServices;

/**
 * Verifies registration and scoring behavior for occasional components.
 */
class OccasionalMeetingIntegrationTest {
    private ScheduleSolver solver;

    /**
     * Creates a solver with production scheduling services.
     */
    @BeforeEach
    void setUp() {
        ConflictDetector conflictDetector = new ConflictDetector();
        solver = new ScheduleSolver(
            new ScheduleGenerator(conflictDetector, TestServices.courseOptionGenerator(conflictDetector)),
            new ScheduleAnalyzer(),
            new ScheduleEvaluator(),
            new ScheduleRuleFactory()
        );
    }

    /**
     * Verifies that preference penalties caused by occasional meetings receive one-third weight.
     */
    @Test
    void weightsOccasionalPreferencePenaltiesAtOneThird() {
        Course course = course("ECE 2000", MeetingFrequency.OCCASIONAL, section(
            "ECE 2000",
            MeetingFrequency.OCCASIONAL,
            "001",
            meeting(DayOfWeek.MONDAY, 8, 0, 9, 0)
        ));

        ScheduleSolution solution = solver.solve(
            List.of(course),
            List.of(rule(RuleType.EARLIEST_START, RuleMode.PREFERENCE, 3, LocalTime.of(9, 0), null)),
            1
        ).get(0);

        assertEquals(60, solution.getScore());
        assertEquals(60, solution.getRuleEvaluations().get(0).penalty());
    }

    /**
     * Verifies that frequency weighting retains fractional penalties instead of rounding them away.
     */
    @Test
    void preservesFractionalFrequencyWeightedScores() {
        Course course = course("ECE 2000", MeetingFrequency.OCCASIONAL, section(
            "ECE 2000",
            MeetingFrequency.OCCASIONAL,
            "001",
            meeting(DayOfWeek.MONDAY, 8, 59, 9, 59)
        ));

        ScheduleSolution solution = solver.solve(
            List.of(course),
            List.of(rule(RuleType.EARLIEST_START, RuleMode.PREFERENCE, 1, LocalTime.of(9, 0), null)),
            1
        ).get(0);

        assertEquals(1.0 / 3.0, solution.getScore(), 0.000_001);
        assertEquals(1.0 / 3.0, solution.getRuleEvaluations().get(0).penalty(), 0.000_001);
    }

    /**
     * Verifies that hard requirements apply to occasional-meeting weeks.
     */
    @Test
    void appliesHardRequirementsToOccasionalWeeks() {
        Course course = course("ECE 2000", MeetingFrequency.OCCASIONAL, section(
            "ECE 2000",
            MeetingFrequency.OCCASIONAL,
            "001",
            meeting(DayOfWeek.MONDAY, 8, 0, 9, 0)
        ));

        List<ScheduleSolution> solutions = solver.solve(
            List.of(course),
            List.of(rule(RuleType.EARLIEST_START, RuleMode.HARD, 3, LocalTime.of(9, 0), null)),
            1
        );

        assertTrue(solutions.isEmpty());
    }

    /**
     * Verifies that gaps present when an occasional component is absent receive two-thirds weight.
     */
    @Test
    void weightsRegularWeekGapsAtTwoThirds() {
        Course morning = course("SE 2001", MeetingFrequency.WEEKLY, section(
            "SE 2001", MeetingFrequency.WEEKLY, "001", meeting(DayOfWeek.MONDAY, 9, 0, 10, 0)));
        Course occasional = course("SE 2002", MeetingFrequency.OCCASIONAL, section(
            "SE 2002", MeetingFrequency.OCCASIONAL, "001", meeting(DayOfWeek.MONDAY, 11, 0, 12, 0)));
        Course afternoon = course("SE 2003", MeetingFrequency.WEEKLY, section(
            "SE 2003", MeetingFrequency.WEEKLY, "001", meeting(DayOfWeek.MONDAY, 13, 0, 14, 0)));

        ScheduleSolution solution = solver.solve(
            List.of(morning, occasional, afternoon),
            List.of(rule(RuleType.MAXIMUM_GAP, RuleMode.PREFERENCE, 1, null, 60)),
            1
        ).get(0);

        assertEquals(80, solution.getScore());
    }

    /**
     * Verifies that the day-edge strategy prefers an occasional meeting outside regular classes.
     */
    @Test
    void prefersOccasionalMeetingsAtDayEdges() {
        Course morning = course("SE 2001", MeetingFrequency.WEEKLY, section(
            "SE 2001", MeetingFrequency.WEEKLY, "001", meeting(DayOfWeek.MONDAY, 9, 0, 10, 0)));
        Course afternoon = course("SE 2002", MeetingFrequency.WEEKLY, section(
            "SE 2002", MeetingFrequency.WEEKLY, "001", meeting(DayOfWeek.MONDAY, 12, 0, 13, 0)));
        Course occasional = course(
            "SE 2003",
            MeetingFrequency.OCCASIONAL,
            section("SE 2003", MeetingFrequency.OCCASIONAL, "MIDDLE", meeting(DayOfWeek.MONDAY, 10, 30, 11, 30)),
            section("SE 2003", MeetingFrequency.OCCASIONAL, "EDGE", meeting(DayOfWeek.MONDAY, 13, 0, 14, 0))
        );

        List<ScheduleSolution> solutions = solver.solve(
            List.of(morning, afternoon, occasional),
            List.of(rule(RuleType.OCCASIONAL_MEETINGS_AT_DAY_EDGES, RuleMode.PREFERENCE, 1, null, null)),
            2
        );

        assertEquals("EDGE", solutions.get(0).getSections().stream()
            .filter(section -> section.courseCode().equals("SE 2003"))
            .findFirst()
            .orElseThrow()
            .id());
        assertEquals(0, solutions.get(0).getScore());
        assertEquals(20, solutions.get(solutions.size() - 1).getScore());
    }

    /**
     * Verifies that occasional meetings remain registration conflicts.
     */
    @Test
    void preventsRegistrationConflictsWithOccasionalMeetings() {
        Course weekly = course("SE 2001", MeetingFrequency.WEEKLY, section(
            "SE 2001", MeetingFrequency.WEEKLY, "001", meeting(DayOfWeek.MONDAY, 9, 0, 10, 0)));
        Course occasional = course("SE 2002", MeetingFrequency.OCCASIONAL, section(
            "SE 2002", MeetingFrequency.OCCASIONAL, "001", meeting(DayOfWeek.MONDAY, 9, 30, 10, 30)));

        assertTrue(solver.solve(List.of(weekly, occasional), List.of(), 1).isEmpty());
    }

    /**
     * Creates one course component with the requested frequency.
     *
     * @param code course code
     * @param frequency meeting frequency
     * @param sections component sections
     * @return course
     */
    private Course course(String code, MeetingFrequency frequency, Section... sections) {
        CourseComponent component = new CourseComponent(
            ComponentType.LEC,
            EnrollmentRequirement.REQUIRED,
            AttendanceRequirement.MANDATORY,
            frequency,
            true,
            List.of(sections)
        );
        return new Course(code, List.of(component));
    }

    /**
     * Creates one section with the requested frequency.
     *
     * @param courseCode course code
     * @param frequency meeting frequency
     * @param sectionId section identifier
     * @param meetings section meetings
     * @return section
     */
    private Section section(
        String courseCode,
        MeetingFrequency frequency,
        String sectionId,
        Meeting... meetings
    ) {
        return new Section(sectionId, List.of(meetings));
    }

    /**
     * Creates one meeting.
     *
     * @param day meeting day
     * @param startHour start hour
     * @param startMinute start minute
     * @param endHour end hour
     * @param endMinute end minute
     * @return meeting
     */
    private Meeting meeting(
        DayOfWeek day,
        int startHour,
        int startMinute,
        int endHour,
        int endMinute
    ) {
        return new Meeting(day, LocalTime.of(startHour, startMinute), LocalTime.of(endHour, endMinute));
    }

    /**
     * Creates one rule configuration.
     *
     * @param type rule type
     * @param mode rule mode
     * @param importance preference weight
     * @param time optional time setting
     * @param minutes optional minute setting
     * @return rule configuration
     */
    private RuleConfiguration rule(
        RuleType type,
        RuleMode mode,
        int importance,
        LocalTime time,
        Integer minutes
    ) {
        RuleSettings settings = switch (type) {
            case EARLIEST_START, LATEST_END -> new RuleSettings.TimeThreshold(time);
            case MAXIMUM_GAP, MAXIMUM_CONTINUOUS_BLOCK, MINIMUM_DAY_LENGTH, MAXIMUM_DAILY_SPAN,
                MAXIMUM_WEEKLY_GAP, BALANCE_WORKLOAD -> new RuleSettings.MinuteThreshold(minutes);
            case MAXIMUM_MEETINGS_PER_DAY, MAXIMUM_CAMPUS_DAYS ->
                throw new IllegalArgumentException("A count value is required for " + type + ".");
            case DAYS_OFF, BLOCKED_TIME ->
                throw new IllegalArgumentException("Day settings are required for " + type + ".");
            case AVOID_SINGLE_MEETING_DAYS, CLUSTER_CAMPUS_DAYS, OCCASIONAL_MEETINGS_AT_DAY_EDGES ->
                new RuleSettings.None();
        };
        return new RuleConfiguration(type, mode, importance, settings);
    }
}
