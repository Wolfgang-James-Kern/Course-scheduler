package com.wolfgangkern.coursescheduler.support;

import com.wolfgangkern.coursescheduler.core.service.ConflictDetector;
import com.wolfgangkern.coursescheduler.core.service.CourseOptionGenerator;
import com.wolfgangkern.coursescheduler.core.service.compatibility.CompositeCourseOptionSpecification;
import com.wolfgangkern.coursescheduler.core.service.compatibility.MeetingConflictSpecification;
import com.wolfgangkern.coursescheduler.core.service.compatibility.SectionCompatibilitySpecification;

/**
 * Creates production service graphs for focused unit tests.
 */
public final class TestServices {
    /**
     * Prevents utility-class construction.
     */
    private TestServices() {}

    /**
     * Creates a course-option generator with all registration specifications.
     *
     * @param conflictDetector exact meeting conflict detector
     * @return configured course-option generator
     */
    public static CourseOptionGenerator courseOptionGenerator(ConflictDetector conflictDetector) {
        CompositeCourseOptionSpecification specification = new CompositeCourseOptionSpecification(
            new MeetingConflictSpecification(conflictDetector),
            new SectionCompatibilitySpecification()
        );
        return new CourseOptionGenerator(specification);
    }
}
