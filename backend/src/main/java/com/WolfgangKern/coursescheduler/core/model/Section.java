package com.wolfgangkern.coursescheduler.core.model;

import java.util.List;

/**
 * One selectable section and its meeting times.
 */
public record Section(String id, List<Meeting> meetings) {
    /**
     * Creates a validated section.
     */
    public Section {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Section identifier is required.");
        }
        if (meetings == null || meetings.isEmpty()) {
            throw new IllegalArgumentException("Section " + id + " must contain at least one meeting.");
        }
        meetings = List.copyOf(meetings);
        validateMeetingConflicts(id, meetings);
    }

    /**
     * Rejects overlapping meetings inside a single section.
     */
    private static void validateMeetingConflicts(String sectionId, List<Meeting> sectionMeetings) {
        for (int first = 0; first < sectionMeetings.size(); first++) {
            for (int second = first + 1; second < sectionMeetings.size(); second++) {
                Meeting firstMeeting = sectionMeetings.get(first);
                Meeting secondMeeting = sectionMeetings.get(second);
                boolean overlaps = firstMeeting.day() == secondMeeting.day()
                    && firstMeeting.startTime().isBefore(secondMeeting.endTime())
                    && secondMeeting.startTime().isBefore(firstMeeting.endTime());
                if (overlaps) {
                    throw new IllegalArgumentException("Section " + sectionId + " contains overlapping meetings.");
                }
            }
        }
    }
}
