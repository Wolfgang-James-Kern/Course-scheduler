package com.wolfgangkern.coursescheduler.core.service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.AttendanceRequirement;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;
import com.wolfgangkern.coursescheduler.core.model.ScheduleStats;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.rule.ScheduleContext;

/**
 * Produces ordered daily views and summary statistics for generated schedules.
 */
@Component
public final class ScheduleAnalyzer {
    /**
     * Analyzes a completed schedule including occasional meetings.
     *
     * @param sections selected sections
     * @return immutable full-week context
     */
    public ScheduleContext analyze(List<SelectedSection> sections) {
        return analyzeBoth(sections).fullWeek();
    }

    /**
     * Builds regular and full-week contexts in one pass over selected sections.
     *
     * @param sections selected sections
     * @return both frequency-aware contexts
     */
    public ScheduleAnalysis analyzeBoth(List<SelectedSection> sections) {
        if (sections == null) {
            throw new IllegalArgumentException("Selected sections are required for analysis.");
        }
        EnumMap<DayOfWeek, List<Meeting>> regularMeetings = new EnumMap<>(DayOfWeek.class);
        EnumMap<DayOfWeek, List<Meeting>> fullMeetings = new EnumMap<>(DayOfWeek.class);

        for (SelectedSection section : sections) {
            if (section.attendanceRequirement() == AttendanceRequirement.NON_MANDATORY) {
                continue;
            }
            addMeetings(fullMeetings, section.meetings());
            if (section.meetingFrequency() == MeetingFrequency.WEEKLY) {
                addMeetings(regularMeetings, section.meetings());
            }
        }

        sortMeetings(regularMeetings);
        sortMeetings(fullMeetings);
        return new ScheduleAnalysis(
            buildContext(sections, regularMeetings),
            buildContext(sections, fullMeetings)
        );
    }

    /**
     * Adds meetings to their weekday lists.
     *
     * @param meetingsByDay target weekday map
     * @param meetings meetings to add
     */
    private void addMeetings(Map<DayOfWeek, List<Meeting>> meetingsByDay, List<Meeting> meetings) {
        for (Meeting meeting : meetings) {
            meetingsByDay.computeIfAbsent(meeting.day(), ignored -> new ArrayList<>()).add(meeting);
        }
    }

    /**
     * Orders each day chronologically.
     *
     * @param meetingsByDay weekday meeting map
     */
    private void sortMeetings(Map<DayOfWeek, List<Meeting>> meetingsByDay) {
        meetingsByDay.values().forEach(meetings -> meetings.sort(Comparator.comparing(Meeting::startTime)));
    }

    /**
     * Creates statistics and an immutable schedule context from grouped meetings.
     *
     * @param sections selected sections
     * @param meetingsByDay ordered weekday meetings
     * @return analyzed schedule context
     */
    private ScheduleContext buildContext(
        List<SelectedSection> sections,
        Map<DayOfWeek, List<Meeting>> meetingsByDay
    ) {
        LocalTime earliestStart = null;
        LocalTime latestEnd = null;
        int totalGapMinutes = 0;

        for (List<Meeting> meetings : meetingsByDay.values()) {
            if (meetings.isEmpty()) {
                continue;
            }
            LocalTime dailyStart = meetings.get(0).startTime();
            LocalTime dailyEnd = meetings.get(meetings.size() - 1).endTime();
            if (earliestStart == null || dailyStart.isBefore(earliestStart)) {
                earliestStart = dailyStart;
            }
            if (latestEnd == null || dailyEnd.isAfter(latestEnd)) {
                latestEnd = dailyEnd;
            }
            totalGapMinutes += calculateDailyGap(meetings);
        }

        int activeDays = Math.toIntExact(meetingsByDay.values().stream()
            .filter(meetings -> !meetings.isEmpty())
            .count());
        return new ScheduleContext(
            sections,
            meetingsByDay,
            new ScheduleStats(earliestStart, latestEnd, totalGapMinutes, activeDays)
        );
    }

    /**
     * Calculates total time between consecutive meetings on one day.
     *
     * @param meetings ordered meetings
     * @return total gap minutes
     */
    private int calculateDailyGap(List<Meeting> meetings) {
        int gapMinutes = 0;
        for (int index = 0; index < meetings.size() - 1; index++) {
            long gap = Duration.between(meetings.get(index).endTime(), meetings.get(index + 1).startTime()).toMinutes();
            gapMinutes += Math.toIntExact(Math.max(0, gap));
        }
        return gapMinutes;
    }
}
