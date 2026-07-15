package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

/**
 * Contains ranked schedules returned by the solver.
 *
 * @param schedules ranked schedules
 */
public record SolveResponse(List<ScheduleDto> schedules) {
    /**
     * Protects the response from later list mutation.
     */
    public SolveResponse {
        schedules = schedules == null ? List.of() : List.copyOf(schedules);
    }
}
