package com.wolfgangkern.coursescheduler.core.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.rule.RuleMode;
import com.wolfgangkern.coursescheduler.core.rule.RuleSettings;
import com.wolfgangkern.coursescheduler.core.rule.RuleType;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRuleFactory;
import com.wolfgangkern.coursescheduler.support.TestServices;

/**
 * Verifies exact conflict detection and configurable rule behavior.
 */
class ScheduleRuleIntegrationTest {
    private ScheduleSolver solver;

    /**
     * Creates a fresh solver before each test.
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
     * Verifies conflicts that do not align with thirty-minute boundaries.
     */
    @Test
    void excludesPartialSlotConflicts() {
        Course firstCourse = course("CS 1010", section(
            "CS 1010", "001", meeting(DayOfWeek.MONDAY, 10, 10, 10, 20)));
        Course secondCourse = course("MATH 2001", section(
            "MATH 2001", "001", meeting(DayOfWeek.MONDAY, 10, 15, 10, 45)));

        assertTrue(solver.solve(List.of(firstCourse, secondCourse), List.of(), 5).isEmpty());
    }

    /**
     * Verifies that adjacent meetings do not conflict.
     */
    @Test
    void allowsAdjacentMeetings() {
        Course firstCourse = course("CS 1010", section(
            "CS 1010", "001", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0)));
        Course secondCourse = course("MATH 2001", section(
            "MATH 2001", "001", meeting(DayOfWeek.MONDAY, 11, 0, 12, 0)));

        assertEquals(1, solver.solve(List.of(firstCourse, secondCourse), List.of(), 5).size());
    }

    /**
     * Verifies that hard requirements remove violating schedules.
     */
    @Test
    void hardRuleExcludesViolatingSchedule() {
        Course course = course(
            "CS 1010",
            section("CS 1010", "EARLY", meeting(DayOfWeek.MONDAY, 8, 0, 9, 0)),
            section("CS 1010", "LATE", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0))
        );
        RuleConfiguration rule = earliestStartRule(RuleMode.HARD);

        List<ScheduleSolution> solutions = solver.solve(List.of(course), List.of(rule), 5);

        assertEquals(1, solutions.size());
        assertEquals("LATE", solutions.get(0).getSections().get(0).id());
        assertTrue(solutions.get(0).getRuleEvaluations().get(0).satisfied());
    }

    /**
     * Verifies that weighted preferences rank candidates without excluding them.
     */
    @Test
    void preferenceRuleRanksAllCandidates() {
        Course course = course(
            "CS 1010",
            section("CS 1010", "EARLY", meeting(DayOfWeek.MONDAY, 8, 30, 9, 30)),
            section("CS 1010", "LATE", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0))
        );
        RuleConfiguration rule = earliestStartRule(RuleMode.PREFERENCE);

        List<ScheduleSolution> solutions = solver.solve(List.of(course), List.of(rule), 5);

        assertEquals(2, solutions.size());
        assertEquals("LATE", solutions.get(0).getSections().get(0).id());
        assertEquals(0, solutions.get(0).getScore());
        assertEquals(90, solutions.get(solutions.size() - 1).getScore());
        assertFalse(solutions.get(solutions.size() - 1).getRuleEvaluations().get(0).satisfied());
    }

    /**
     * Creates an earliest-start configuration for a test scenario.
     *
     * @param mode requested mode
     * @return earliest-start configuration
     */
    private RuleConfiguration earliestStartRule(RuleMode mode) {
        return new RuleConfiguration(
            RuleType.EARLIEST_START,
            mode,
            3,
            new RuleSettings.TimeThreshold(LocalTime.of(9, 0))
        );
    }

    /**
     * Creates a course for a test scenario.
     *
     * @param code course code
     * @param sections course sections
     * @return course
     */
    private Course course(String code, Section... sections) {
        CourseComponent lecture = new CourseComponent(
            ComponentType.LEC,
            EnrollmentRequirement.REQUIRED,
            AttendanceRequirement.MANDATORY,
            true,
            List.of(sections)
        );
        return new Course(code, List.of(lecture));
    }

    /**
     * Creates a section for a test scenario.
     *
     * @param courseCode owning course code
     * @param sectionId section identifier
     * @param meetings section meetings
     * @return section
     */
    private Section section(String courseCode, String sectionId, Meeting... meetings) {
        return new Section(sectionId, List.of(meetings));
    }

    /**
     * Creates a meeting for a test scenario.
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
}
