package com.wolfgangkern.coursescheduler.core.rule;

import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.AttendanceRequirement;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;

/**
 * Prefers occasional meetings before or after the regular classes on their day.
 */
public final class OccasionalMeetingsAtDayEdgesRule extends AbstractScheduleRule {
    private static final int SANDWICHED_MEETING_PENALTY = 60;

    /**
     * Creates an occasional-meeting placement strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     */
    public OccasionalMeetingsAtDayEdgesRule(RuleMode mode, int importance) {
        super(RuleType.OCCASIONAL_MEETINGS_AT_DAY_EDGES, mode, importance);
    }

    /**
     * Finds occasional meetings positioned between regular meetings.
     *
     * @param context analyzed schedule
     * @return occasional-placement result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        List<Meeting> regularMeetings = context.getSections().stream()
            .filter(section -> section.attendanceRequirement() == AttendanceRequirement.MANDATORY)
            .filter(section -> section.meetingFrequency() == MeetingFrequency.WEEKLY)
            .flatMap(section -> section.meetings().stream())
            .toList();
        long sandwichedMeetings = context.getSections().stream()
            .filter(section -> section.attendanceRequirement() == AttendanceRequirement.MANDATORY)
            .filter(section -> section.meetingFrequency() == MeetingFrequency.OCCASIONAL)
            .flatMap(section -> section.meetings().stream())
            .filter(meeting -> context.getMeetings(meeting.day()).contains(meeting))
            .filter(meeting -> isSandwiched(meeting, regularMeetings))
            .count();
        return result(
            Math.toIntExact(sandwichedMeetings) * SANDWICHED_MEETING_PENALTY,
            "Occasional meetings are positioned at the edges of their class days.",
            "At least one occasional meeting is positioned between regular classes."
        );
    }

    /**
     * Determines whether regular meetings occur before and after an occasional meeting.
     *
     * @param occasionalMeeting occasional meeting
     * @param regularMeetings regular mandatory meetings
     * @return true when the occasional meeting is between regular meetings
     */
    private boolean isSandwiched(Meeting occasionalMeeting, List<Meeting> regularMeetings) {
        boolean hasMeetingBefore = regularMeetings.stream().anyMatch(meeting -> (
            meeting.day() == occasionalMeeting.day()
            && !meeting.endTime().isAfter(occasionalMeeting.startTime())
        ));
        boolean hasMeetingAfter = regularMeetings.stream().anyMatch(meeting -> (
            meeting.day() == occasionalMeeting.day()
            && !meeting.startTime().isBefore(occasionalMeeting.endTime())
        ));
        return hasMeetingBefore && hasMeetingAfter;
    }
}
