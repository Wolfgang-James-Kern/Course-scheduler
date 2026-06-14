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
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.rule.RuleMode;
import com.wolfgangkern.coursescheduler.core.rule.RuleSettings;
import com.wolfgangkern.coursescheduler.core.rule.RuleType;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleRuleFactory;
import com.wolfgangkern.coursescheduler.support.TestServices;

/**
 * Verifies schedule generation, statistics, ordering, and result limits.
 */
class ScheduleSolverTest {
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
     * Verifies statistics calculated from meetings across multiple days.
     */
    @Test
    void calculatesScheduleStatistics() {
        Course firstCourse = course("CS 1010", section(
            "CS 1010",
            "001",
            meeting(DayOfWeek.MONDAY, 9, 0, 10, 0),
            meeting(DayOfWeek.MONDAY, 17, 30, 19, 0)
        ));
        Course secondCourse = course("MATH 2001", section(
            "MATH 2001",
            "001",
            meeting(DayOfWeek.WEDNESDAY, 11, 0, 12, 0)
        ));

        ScheduleSolution solution = solver.solve(
            List.of(firstCourse, secondCourse),
            List.of(),
            5
        ).get(0);

        assertEquals(LocalTime.of(9, 0), solution.getStats().earliestStart());
        assertEquals(LocalTime.of(19, 0), solution.getStats().latestEnd());
        assertEquals(450, solution.getStats().totalGapMinutes());
        assertEquals(2, solution.getStats().daysWithClasses());
    }

    /**
     * Verifies that an empty course request returns no schedules.
     */
    @Test
    void returnsEmptyResultWithoutCourses() {
        assertTrue(solver.solve(List.of(), List.of(), 5).isEmpty());
    }

    /**
     * Verifies that every conflict-free section combination is generated.
     */
    @Test
    void generatesAllValidCombinations() {
        Course firstCourse = course(
            "CS 1010",
            section("CS 1010", "001", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0)),
            section("CS 1010", "002", meeting(DayOfWeek.TUESDAY, 10, 0, 11, 0))
        );
        Course secondCourse = course(
            "MATH 2001",
            section("MATH 2001", "001", meeting(DayOfWeek.MONDAY, 11, 0, 12, 0)),
            section("MATH 2001", "002", meeting(DayOfWeek.TUESDAY, 11, 0, 12, 0))
        );

        assertEquals(4, solver.solve(List.of(firstCourse, secondCourse), List.of(), 5).size());
    }

    /**
     * Verifies that conflicting section combinations are removed.
     */
    @Test
    void excludesConflictingCombinations() {
        Course firstCourse = course(
            "CS 1010",
            section("CS 1010", "001", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0)),
            section("CS 1010", "002", meeting(DayOfWeek.TUESDAY, 10, 0, 11, 0))
        );
        Course secondCourse = course(
            "MATH 2001",
            section("MATH 2001", "001", meeting(DayOfWeek.MONDAY, 10, 30, 11, 30)),
            section("MATH 2001", "002", meeting(DayOfWeek.TUESDAY, 11, 0, 12, 0))
        );

        assertEquals(3, solver.solve(List.of(firstCourse, secondCourse), List.of(), 5).size());
    }

    /**
     * Verifies that the solver retains only the requested number of results.
     */
    @Test
    void respectsResultLimit() {
        Course course = course(
            "CS 1010",
            section("CS 1010", "001", meeting(DayOfWeek.MONDAY, 9, 0, 10, 0)),
            section("CS 1010", "002", meeting(DayOfWeek.TUESDAY, 9, 0, 10, 0)),
            section("CS 1010", "003", meeting(DayOfWeek.WEDNESDAY, 9, 0, 10, 0))
        );

        assertEquals(2, solver.solve(List.of(course), List.of(), 2).size());
    }

    /**
     * Verifies that returned schedules are ordered from lowest score to highest.
     */
    @Test
    void returnsSchedulesBestFirst() {
        Course firstCourse = course(
            "CS 1010",
            section("CS 1010", "001", meeting(DayOfWeek.MONDAY, 10, 0, 11, 0)),
            section("CS 1010", "002", meeting(DayOfWeek.TUESDAY, 11, 0, 12, 0))
        );
        Course secondCourse = course(
            "MATH 2001",
            section("MATH 2001", "001", meeting(DayOfWeek.MONDAY, 13, 0, 14, 0)),
            section("MATH 2001", "002", meeting(DayOfWeek.TUESDAY, 14, 0, 15, 0))
        );

        List<ScheduleSolution> solutions = solver.solve(
            List.of(firstCourse, secondCourse),
            List.of(new RuleConfiguration(
                RuleType.MAXIMUM_GAP,
                RuleMode.PREFERENCE,
                1,
                new RuleSettings.MinuteThreshold(60)
            )),
            5
        );

        for (int index = 1; index < solutions.size(); index++) {
            assertTrue(solutions.get(index - 1).getScore() <= solutions.get(index).getScore());
        }
    }

    /**
     * Verifies that equal-scoring schedules use a stable domain key as their tie-breaker.
     */
    @Test
    void ordersEqualScoresDeterministically() {
        Course course = course(
            "CS 1010",
            section("CS 1010", "B", meeting(DayOfWeek.TUESDAY, 9, 0, 10, 0)),
            section("CS 1010", "A", meeting(DayOfWeek.MONDAY, 9, 0, 10, 0))
        );

        for (int attempt = 0; attempt < 3; attempt++) {
            List<ScheduleSolution> solutions = solver.solve(List.of(course), List.of(), 2);

            assertEquals("A", solutions.get(0).getSections().get(0).id());
            assertEquals("B", solutions.get(1).getSections().get(0).id());
        }
    }

    /**
     * Creates a course for a test scenario.
     *
     * @param code course code
     * @param sections available sections
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
