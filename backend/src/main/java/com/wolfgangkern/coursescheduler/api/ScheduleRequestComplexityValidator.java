package com.wolfgangkern.coursescheduler.api;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.api.dto.CourseComponentDto;
import com.wolfgangkern.coursescheduler.api.dto.CourseDto;
import com.wolfgangkern.coursescheduler.api.dto.SolveRequest;

/**
 * Rejects requests whose theoretical candidate space is too expensive to enumerate safely.
 */
@Component
public final class ScheduleRequestComplexityValidator {
    static final long MAX_CANDIDATE_COMBINATIONS = 5_000_000L;

    /**
     * Validates the upper bound of a request's schedule search space.
     *
     * @param request validated structural request
     */
    public void validate(SolveRequest request) {
        long globalCombinations = 1;
        for (CourseDto course : request.courses()) {
            long courseOptions = estimateCourseOptions(course);
            globalCombinations = multiplyWithinLimit(globalCombinations, courseOptions);
        }
    }

    /**
     * Estimates per-course section combinations before compatibility and conflict pruning.
     *
     * @param course requested course
     * @return theoretical course-option count
     */
    private long estimateCourseOptions(CourseDto course) {
        long courseOptions = 1;
        for (CourseComponentDto component : course.components()) {
            if (!isIncluded(component)) {
                continue;
            }
            int sectionCount = component.sections() == null ? 0 : component.sections().size();
            courseOptions = multiplyWithinLimit(courseOptions, sectionCount);
        }
        return courseOptions;
    }

    /**
     * Reports whether a component participates in registration generation.
     * Required components are always included. Optional components count only when
     * {@code included} is explicitly {@code true} (null means excluded).
     *
     * @param component requested component
     * @return true when a section must be selected
     */
    static boolean isIncluded(CourseComponentDto component) {
        if (component.enrollmentRequirement() == null
            || component.enrollmentRequirement().equalsIgnoreCase("REQUIRED")) {
            return true;
        }
        return Boolean.TRUE.equals(component.included());
    }

    /**
     * Multiplies two branching factors without allowing overflow or excessive work.
     *
     * @param current current combination estimate
     * @param factor next branching factor
     * @return updated estimate
     */
    private long multiplyWithinLimit(long current, long factor) {
        if (factor == 0) {
            return 0;
        }
        if (current > MAX_CANDIDATE_COMBINATIONS / factor) {
            throw new InvalidScheduleRequestException(
                "REQUEST_TOO_COMPLEX",
                "The requested course combinations exceed the scheduling limit.",
                "courses"
            );
        }
        long product = current * factor;
        if (product > MAX_CANDIDATE_COMBINATIONS) {
            throw new InvalidScheduleRequestException(
                "REQUEST_TOO_COMPLEX",
                "The requested course combinations exceed the scheduling limit.",
                "courses"
            );
        }
        return product;
    }
}
