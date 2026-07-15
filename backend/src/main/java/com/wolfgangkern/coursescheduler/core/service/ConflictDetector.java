package com.wolfgangkern.coursescheduler.core.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Detects exact meeting-time conflicts without rounding times into fixed slots.
 */
@Component
public final class ConflictDetector {
    /**
     * Determines whether a candidate section conflicts with selected sections.
     *
     * @param selectedSections sections already in the schedule
     * @param candidate candidate section
     * @return true when any meetings overlap
     */
    public boolean conflicts(List<SelectedSection> selectedSections, SelectedSection candidate) {
        for (SelectedSection selected : selectedSections) {
            for (Meeting existingMeeting : selected.meetings()) {
                for (Meeting candidateMeeting : candidate.meetings()) {
                    if (overlaps(existingMeeting, candidateMeeting)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Determines whether two half-open meeting intervals overlap on the same day.
     *
     * @param first first meeting
     * @param second second meeting
     * @return true when the meetings overlap
     */
    public boolean overlaps(Meeting first, Meeting second) {
        return first.day() == second.day()
            && first.startTime().isBefore(second.endTime())
            && second.startTime().isBefore(first.endTime());
    }
}
