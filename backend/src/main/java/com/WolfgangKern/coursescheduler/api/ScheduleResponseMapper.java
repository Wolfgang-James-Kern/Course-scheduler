package com.wolfgangkern.coursescheduler.api;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.api.dto.MeetingDto;
import com.wolfgangkern.coursescheduler.api.dto.RuleEvaluationDto;
import com.wolfgangkern.coursescheduler.api.dto.ScheduleDto;
import com.wolfgangkern.coursescheduler.api.dto.SectionDto;
import com.wolfgangkern.coursescheduler.api.dto.SolveResponse;
import com.wolfgangkern.coursescheduler.api.dto.StatsDto;
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.model.ScheduleStats;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.rule.RuleEvaluation;

/**
 * Maps domain scheduling results into API response records.
 */
@Component
public final class ScheduleResponseMapper {
    /**
     * Maps ranked domain solutions into one response.
     *
     * @param solutions ranked solutions
     * @return API response
     */
    public SolveResponse toResponse(List<ScheduleSolution> solutions) {
        return new SolveResponse(solutions.stream().map(this::toSchedule).toList());
    }

    /**
     * Maps one domain solution.
     *
     * @param solution domain solution
     * @return schedule response
     */
    private ScheduleDto toSchedule(ScheduleSolution solution) {
        List<SectionDto> sections = solution.getSections().stream().map(this::toSection).toList();
        ScheduleStats stats = solution.getStats();
        StatsDto statsDto = new StatsDto(
            stats.earliestStart() == null ? null : stats.earliestStart().toString(),
            stats.latestEnd() == null ? null : stats.latestEnd().toString(),
            stats.totalGapMinutes(),
            stats.daysWithClasses()
        );
        List<RuleEvaluationDto> evaluations = solution.getRuleEvaluations().stream().map(this::toEvaluation).toList();
        return new ScheduleDto(sections, statsDto, solution.getScore(), evaluations);
    }

    /**
     * Maps one selected section.
     *
     * @param section selected section
     * @return section response
     */
    private SectionDto toSection(SelectedSection section) {
        List<MeetingDto> meetings = section.meetings().stream()
            .map(meeting -> new MeetingDto(
                meeting.day().toString(),
                meeting.startTime().toString(),
                meeting.endTime().toString()
            ))
            .toList();
        return new SectionDto(
            section.courseCode(),
            section.componentType().toString(),
            section.attendanceRequirement().toString(),
            section.meetingFrequency().toString(),
            section.id(),
            meetings
        );
    }

    /**
     * Maps one rule evaluation.
     *
     * @param evaluation domain rule result
     * @return rule result response
     */
    private RuleEvaluationDto toEvaluation(RuleEvaluation evaluation) {
        return new RuleEvaluationDto(
            evaluation.type().toString(),
            evaluation.mode().toString(),
            evaluation.satisfied(),
            evaluation.violation(),
            evaluation.penalty(),
            evaluation.explanation()
        );
    }
}
