package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.ScheduleStats;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Provides rule strategies with immutable views of an analyzed schedule.
 */
public final class ScheduleContext {
    private final List<SelectedSection> sections;
    private final Map<DayOfWeek, List<Meeting>> meetingsByDay;
    private final ScheduleStats stats;

    /**
     * Creates an analyzed schedule context.
     *
     * @param sections chosen course sections
     * @param meetingsByDay meetings grouped and ordered by day
     * @param stats summary statistics
     */
    public ScheduleContext(
        List<SelectedSection> sections,
        Map<DayOfWeek, List<Meeting>> meetingsByDay,
        ScheduleStats stats
    ) {
        this.sections = List.copyOf(sections);
        EnumMap<DayOfWeek, List<Meeting>> copiedMeetings = new EnumMap<>(DayOfWeek.class);
        meetingsByDay.forEach((day, meetings) -> copiedMeetings.put(day, List.copyOf(meetings)));
        this.meetingsByDay = Map.copyOf(copiedMeetings);
        this.stats = stats;
    }

    /**
     * Returns the selected sections.
     *
     * @return immutable section list
     */
    public List<SelectedSection> getSections() {
        return sections;
    }

    /**
     * Returns ordered meetings for one day.
     *
     * @param day requested day
     * @return immutable meeting list
     */
    public List<Meeting> getMeetings(DayOfWeek day) {
        return meetingsByDay.getOrDefault(day, List.of());
    }

    /**
     * Returns mandatory scheduled class time for one day.
     *
     * @param day requested day
     * @return scheduled minutes
     */
    public int getScheduledMinutes(DayOfWeek day) {
        return getMeetings(day).stream()
            .mapToInt(meeting -> Math.toIntExact(Duration.between(
                meeting.startTime(), meeting.endTime()).toMinutes()))
            .sum();
    }

    /**
     * Returns all days containing at least one meeting.
     *
     * @return active school days
     */
    public List<DayOfWeek> getActiveDays() {
        return meetingsByDay.entrySet().stream()
            .filter(entry -> !entry.getValue().isEmpty())
            .map(Map.Entry::getKey)
            .sorted()
            .toList();
    }

    /**
     * Returns the calculated schedule statistics.
     *
     * @return schedule statistics
     */
    public ScheduleStats getStats() {
        return stats;
    }
}
