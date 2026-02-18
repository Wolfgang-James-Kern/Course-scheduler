package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * CourseDto: Represents a course with all available sections.
 */
public class CourseDto {
    
    private String code;
    private List<SectionDto> sections;

    CourseDto() {}

    /*
     * Getters and Setters, no special conditions needed 
     */

    public String getCode() {
        return code;
    }

    public void setCode(String courseId) {
        this.code = courseId;
    }

    public List<SectionDto> getSections() {
        return sections;
    }

    public void setSections(List<SectionDto> sections) {
        this.sections = sections;
    }
    
}
