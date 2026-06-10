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
import com.wolfgangkern.coursescheduler.core.model.ComponentCompatibility;
import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.CourseComponent;
import com.wolfgangkern.coursescheduler.core.model.CourseOption;
import com.wolfgangkern.coursescheduler.core.model.EnrollmentRequirement;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;
import com.wolfgangkern.coursescheduler.core.model.ScheduleStats;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.model.SectionPair;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.support.TestServices;

/**
 * Verifies component combination generation and attendance separation.
 */
class CourseOptionGeneratorTest {
    private CourseOptionGenerator generator;

    /**
     * Creates a fresh generator before each test.
     */
    @BeforeEach
    void setUp() {
        generator = TestServices.courseOptionGenerator(new ConflictDetector());
    }

    /**
     * Verifies one selected section per included component and internal conflict removal.
     */
    @Test
    void generatesConflictFreeComponentCombinations() {
        CourseComponent lecture = component(
            ComponentType.LEC,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "001", DayOfWeek.MONDAY, 9, 0, 10, 0),
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "002", DayOfWeek.TUESDAY, 9, 0, 10, 0)
        );
        CourseComponent lab = component(
            ComponentType.LAB,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LAB, AttendanceRequirement.MANDATORY, "003", DayOfWeek.MONDAY, 9, 30, 10, 30),
            section(ComponentType.LAB, AttendanceRequirement.MANDATORY, "004", DayOfWeek.WEDNESDAY, 9, 0, 10, 0)
        );

        List<CourseOption> options = generator.generate(new Course("CS 1010", List.of(lecture, lab)));

        assertEquals(3, options.size());
        assertTrue(options.stream().allMatch(option -> option.sections().size() == 2));
    }

    /**
     * Verifies that explicit lecture-lab pairings remove incompatible combinations.
     */
    @Test
    void enforcesSectionCompatibility() {
        CourseComponent lecture = component(
            ComponentType.LEC,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "001", DayOfWeek.MONDAY, 9, 0, 10, 0),
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "003", DayOfWeek.TUESDAY, 9, 0, 10, 0)
        );
        CourseComponent lab = component(
            ComponentType.LAB,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LAB, AttendanceRequirement.MANDATORY, "002", DayOfWeek.WEDNESDAY, 9, 0, 10, 0),
            section(ComponentType.LAB, AttendanceRequirement.MANDATORY, "005", DayOfWeek.THURSDAY, 9, 0, 10, 0)
        );
        ComponentCompatibility compatibility = new ComponentCompatibility(
            ComponentType.LEC,
            ComponentType.LAB,
            List.of(new SectionPair("001", "002"), new SectionPair("003", "005"))
        );

        List<CourseOption> options = generator.generate(new Course(
            "CS 1010",
            List.of(lecture, lab),
            List.of(compatibility)
        ));

        assertEquals(2, options.size());
        assertTrue(options.stream().anyMatch(option -> option.sections().stream().map(SelectedSection::id).toList().containsAll(List.of("001", "002"))));
        assertTrue(options.stream().anyMatch(option -> option.sections().stream().map(SelectedSection::id).toList().containsAll(List.of("003", "005"))));
    }

    /**
     * Verifies that non-mandatory meetings still prevent invalid registration overlaps.
     */
    @Test
    void nonMandatoryAttendanceStillConflictsDuringRegistration() {
        CourseComponent lecture = component(
            ComponentType.LEC,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "001", DayOfWeek.MONDAY, 9, 0, 10, 0)
        );
        CourseComponent tutorial = component(
            ComponentType.TUT,
            AttendanceRequirement.NON_MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.TUT, AttendanceRequirement.NON_MANDATORY, "002", DayOfWeek.MONDAY, 9, 30, 10, 30)
        );

        assertTrue(generator.generate(new Course("CS 1010", List.of(lecture, tutorial))).isEmpty());
    }

    /**
     * Verifies that an excluded optional component does not require a section selection.
     */
    @Test
    void skipsExcludedOptionalComponent() {
        CourseComponent lecture = component(
            ComponentType.LEC,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.REQUIRED,
            true,
            section(ComponentType.LEC, AttendanceRequirement.MANDATORY, "001", DayOfWeek.MONDAY, 9, 0, 10, 0)
        );
        CourseComponent tutorial = component(
            ComponentType.TUT,
            AttendanceRequirement.MANDATORY,
            EnrollmentRequirement.OPTIONAL,
            false
        );

        List<CourseOption> options = generator.generate(new Course("CS 1010", List.of(lecture, tutorial)));

        assertEquals(1, options.size());
        assertEquals(1, options.get(0).sections().size());
    }

    /**
     * Verifies that schedule statistics ignore non-mandatory attendance.
     */
    @Test
    void analyzerIgnoresNonMandatoryAttendance() {
        Section optionalLecture = section(
            ComponentType.LEC,
            AttendanceRequirement.NON_MANDATORY,
            "001",
            DayOfWeek.MONDAY,
            8,
            0,
            9,
            0
        );
        Section mandatoryLab = section(
            ComponentType.LAB,
            AttendanceRequirement.MANDATORY,
            "002",
            DayOfWeek.MONDAY,
            10,
            0,
            11,
            0
        );

        ScheduleStats stats = new ScheduleAnalyzer().analyze(List.of(
            selected(ComponentType.LEC, AttendanceRequirement.NON_MANDATORY, optionalLecture),
            selected(ComponentType.LAB, AttendanceRequirement.MANDATORY, mandatoryLab)
        )).getStats();

        assertEquals(LocalTime.of(10, 0), stats.earliestStart());
        assertEquals(LocalTime.of(11, 0), stats.latestEnd());
        assertEquals(0, stats.totalGapMinutes());
    }

    /**
     * Creates a course component for a test scenario.
     *
     * @param type component type
     * @param attendance attendance requirement
     * @param enrollment enrollment requirement
     * @param included optional-component inclusion state
     * @param sections component sections
     * @return course component
     */
    private CourseComponent component(
        ComponentType type,
        AttendanceRequirement attendance,
        EnrollmentRequirement enrollment,
        boolean included,
        Section... sections
    ) {
        return new CourseComponent(type, enrollment, attendance, included, List.of(sections));
    }

    /**
     * Creates a component section for a test scenario.
     *
     * @param type component type
     * @param attendance attendance requirement
     * @param id section identifier
     * @param day meeting day
     * @param startHour start hour
     * @param startMinute start minute
     * @param endHour end hour
     * @param endMinute end minute
     * @return section
     */
    private Section section(
        ComponentType type,
        AttendanceRequirement attendance,
        String id,
        DayOfWeek day,
        int startHour,
        int startMinute,
        int endHour,
        int endMinute
    ) {
        return new Section(
            id,
            List.of(new Meeting(day, LocalTime.of(startHour, startMinute), LocalTime.of(endHour, endMinute)))
        );
    }

    /**
     * Associates a test section with its component metadata.
     *
     * @param type component type
     * @param attendance attendance requirement
     * @param section section
     * @return selected section
     */
    private SelectedSection selected(ComponentType type, AttendanceRequirement attendance, Section section) {
        return new SelectedSection("CS 1010", type, attendance, MeetingFrequency.WEEKLY, section);
    }
}
