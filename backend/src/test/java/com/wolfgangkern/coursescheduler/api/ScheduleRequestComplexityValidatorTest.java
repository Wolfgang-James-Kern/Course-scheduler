package com.wolfgangkern.coursescheduler.api;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.wolfgangkern.coursescheduler.api.dto.CourseComponentDto;
import com.wolfgangkern.coursescheduler.api.dto.CourseDto;
import com.wolfgangkern.coursescheduler.api.dto.MeetingDto;
import com.wolfgangkern.coursescheduler.api.dto.SectionRequestDto;
import com.wolfgangkern.coursescheduler.api.dto.SolveRequest;

/**
 * Verifies protection against impractically large candidate spaces.
 */
class ScheduleRequestComplexityValidatorTest {
    private final ScheduleRequestComplexityValidator validator = new ScheduleRequestComplexityValidator();

    @Test
    void acceptsBoundedSearchSpace() {
        SolveRequest request = request(4, 40);

        assertDoesNotThrow(() -> validator.validate(request));
    }

    @Test
    void rejectsExcessiveSearchSpace() {
        SolveRequest request = request(5, 40);

        InvalidScheduleRequestException exception = assertThrows(
            InvalidScheduleRequestException.class,
            () -> validator.validate(request)
        );
        assertEquals("REQUEST_TOO_COMPLEX", exception.getCode());
        assertEquals("courses", exception.getField());
    }

    @Test
    void excludesOptionalComponentsWhenIncludedIsNullOrFalse() {
        CourseDto course = new CourseDto(
            "COURSE 1",
            List.of(
                component("LEC", "REQUIRED", true, 40),
                component("TUT", "OPTIONAL", null, 40),
                component("LAB", "OPTIONAL", false, 40)
            ),
            List.of()
        );

        assertDoesNotThrow(() -> validator.validate(new SolveRequest(List.of(course), List.of(), 5)));
    }

    @Test
    void countsOptionalComponentsWhenIncludedIsTrue() {
        List<CourseDto> courses = java.util.stream.IntStream.range(0, 5)
            .mapToObj(index -> new CourseDto(
                "COURSE " + index,
                List.of(
                    component("LEC", "REQUIRED", true, 10),
                    component("TUT", "OPTIONAL", true, 40)
                ),
                List.of()
            ))
            .toList();

        InvalidScheduleRequestException exception = assertThrows(
            InvalidScheduleRequestException.class,
            () -> validator.validate(new SolveRequest(courses, List.of(), 5))
        );
        assertEquals("REQUEST_TOO_COMPLEX", exception.getCode());
    }

    @Test
    void multipliesMultiComponentBranchingFactors() {
        CourseDto course = new CourseDto(
            "COURSE 1",
            List.of(
                component("LEC", "REQUIRED", true, 100),
                component("TUT", "REQUIRED", true, 100),
                component("LAB", "REQUIRED", true, 100)
            ),
            List.of()
        );

        // 100^3 = 1_000_000 under the 5M limit
        assertDoesNotThrow(() -> validator.validate(new SolveRequest(List.of(course), List.of(), 5)));
    }

    private SolveRequest request(int courseCount, int sectionsPerCourse) {
        List<CourseDto> courses = java.util.stream.IntStream.range(0, courseCount)
            .mapToObj(index -> course("COURSE " + index, sectionsPerCourse))
            .toList();
        return new SolveRequest(courses, List.of(), 5);
    }

    private CourseDto course(String code, int sectionCount) {
        return new CourseDto(code, List.of(component("LEC", "REQUIRED", true, sectionCount)), List.of());
    }

    private CourseComponentDto component(String type, String enrollment, Boolean included, int sectionCount) {
        MeetingDto meeting = new MeetingDto("MONDAY", "09:00", "10:00");
        List<SectionRequestDto> sections = java.util.stream.IntStream.range(0, sectionCount)
            .mapToObj(index -> new SectionRequestDto(String.valueOf(index), List.of(meeting)))
            .toList();
        return new CourseComponentDto(type, enrollment, "MANDATORY", "WEEKLY", included, sections);
    }
}
