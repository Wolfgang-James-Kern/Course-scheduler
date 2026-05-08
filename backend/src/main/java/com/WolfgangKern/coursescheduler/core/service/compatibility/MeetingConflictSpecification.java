package com.wolfgangkern.coursescheduler.core.service.compatibility;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.service.ConflictDetector;

/**
 * Rejects component sections whose registration meetings overlap.
 */
@Component
public final class MeetingConflictSpecification implements CourseOptionSpecification {
    private final ConflictDetector conflictDetector;

    /**
     * Creates a meeting-conflict specification.
     *
     * @param conflictDetector exact meeting conflict detector
     */
    public MeetingConflictSpecification(ConflictDetector conflictDetector) {
        this.conflictDetector = conflictDetector;
    }

    /**
     * Evaluates registration-time conflicts.
     *
     * @param course course being expanded
     * @param selectedSections selected component sections
     * @param candidate candidate component section
     * @return true when registration meetings do not overlap
     */
    @Override
    public boolean allows(Course course, List<SelectedSection> selectedSections, SelectedSection candidate) {
        return !conflictDetector.conflicts(selectedSections, candidate);
    }
}
