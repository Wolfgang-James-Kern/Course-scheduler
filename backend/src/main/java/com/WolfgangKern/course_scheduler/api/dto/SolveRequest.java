package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * SolveRequest: Request information for generating schedules.
 * Includes a list of courses, constraints, and the number of top schedules to return.
 */
public class SolveRequest {
    
    private List<CourseDto> courses;
    private ConstraintsDto constraints;
    private int topN;

    SolveRequest() {}

    /*
     * Getters and Setters, no special conditions needed
     */

    public List<CourseDto> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseDto> courses) {
        this.courses = courses;
    }

    public ConstraintsDto getConstraints() {
        return constraints;
    }

    public void setConstraints(ConstraintsDto constraints) {
        this.constraints = constraints;
    }

    public int getTopN() {
        return topN;
    }

    public void setTopN(int topN) {
        this.topN = topN;
    }
}
