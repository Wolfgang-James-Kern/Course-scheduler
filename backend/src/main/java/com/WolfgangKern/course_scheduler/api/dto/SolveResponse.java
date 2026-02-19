package com.WolfgangKern.course_scheduler.api.dto;

import java.util.Collections;
import java.util.List;

/** 
 * SolveResponse: Represents the response from the /solve endpoint, containing the generated schedules and their rankings.
 */
public class SolveResponse {

    private List<ScheduleDto> schedules; // List of generated schedules with a placeholder type, can be replaced with a specific Schedule Object when defined

    public SolveResponse() {
        schedules = Collections.emptyList(); // Initialize with an empty list to avoid null issues
    }

    public SolveResponse(List<ScheduleDto> schedules) {
        this.schedules = schedules;
    }

    /*
     * Getters and Setters, no special conditions needed 
     */
    
    public List<ScheduleDto> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<ScheduleDto> schedules) {
        this.schedules = schedules;
    }
}
