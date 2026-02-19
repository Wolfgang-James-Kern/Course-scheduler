package com.WolfgangKern.course_scheduler.api;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WolfgangKern.course_scheduler.api.dto.*;
import com.WolfgangKern.course_scheduler.core.model.*;
import com.WolfgangKern.course_scheduler.core.service.ScheduleSolver;

@RestController
@RequestMapping("/api")//base path for all endpoints in this controller
public class CourseSchedulerController {
    private final ScheduleSolver solver = new ScheduleSolver();
    
    /**
     * solve: Main endpoint for solving course schedules. It takes a SolveRequest object containing the list of courses and constraints, processes it, and returns a SolveResponse object with the generated schedules.
     * @param request solve request containing courses and constraints
     * @return solve response containing generated schedules
     */
    @PostMapping("/solve")//endpoint for solving the schedules, takes in a SolveRequest object and returns a SolveResponse object
    public SolveResponse solve(@RequestBody SolveRequest request) {
        Constraints constraints = mapConstraints(request.getConstraints());
        List<Course> courses = mapCourse(request.getCourses());

        int topN = request.getTopN() <= 0 ? 5 : request.getTopN(); //default to top 5 if not provided or invalid

        List<ScheduleSolution> solutions = solver.solve(courses, constraints, topN);

        List<ScheduleDto> solvedSchedules = solutions.stream().map(this::mapSolution).toList();

        return new SolveResponse(solvedSchedules);
    }

    /**
     * mapConstraints: maps ConstraintsDto from the API layer to Constraints used in the core service layer.
     * @param dto constraints DTO from the API request
     * @return mapped Constraints object for the core service layer
     */
    private Constraints mapConstraints(ConstraintsDto dto) {
        if(dto == null) return null;

        LocalTime earliestStart = dto.getEarliestStart() != null ? LocalTime.parse(dto.getEarliestStart()) : null;
        LocalTime latestEnd = dto.getLatestEnd() != null ? LocalTime.parse(dto.getLatestEnd()) : null;
        List<DayOfWeek> daysOff = dto.getDaysOff() != null ? dto.getDaysOff().stream().map(String::toUpperCase).map(DayOfWeek::valueOf).toList() : null;

        return new Constraints(earliestStart, latestEnd, daysOff, dto.getMaxGapMinutes());
    }

    /**
     * mapCourse: maps a list of CourseDto objects from the API layer to a list of Course objects used in the core service layer. This involves converting nested structures for sections and meetings as well.
     * @param dto list of CourseDto objects from the API request
     * @return list of Course objects for the core service layer
     */
    private List<Course> mapCourse(List<CourseDto> dto) {
        List<Course> courses = new ArrayList<>();
        if(dto == null) return courses;

        for(CourseDto course : dto) {
            List<Section> sections = new ArrayList<>();
            if(course.getSections() != null) {
                for(SectionDto section : course.getSections()) {
                    List<Meeting> meetings = new ArrayList<>();
                    if(section.getMeetings() != null) {
                        for(MeetingDto meeting : section.getMeetings()) {
                            meetings.add(new Meeting(
                                DayOfWeek.valueOf(meeting.getDay().toUpperCase()), 
                                LocalTime.parse(meeting.getStartTime()), 
                                LocalTime.parse(meeting.getEndTime())));
                        }
                    }
                    sections.add(new Section(section.getCourseCode(), section.getId(), meetings));
                }
            }
            courses.add(new Course(course.getCode(), sections));
        }

        return courses;
    }

    /**
     * mapSolution: maps a ScheduleSolution from the core service layer to a ScheduleDto for the API response. This involves converting the sections, meetings, and stats into their corresponding DTO formats.
     * @param solution ScheduleSolution object from the core service layer that needs to be mapped to ScheduleDto for the API response
     * @return mapped ScheduleDto for the API response
     */
    private ScheduleDto mapSolution(ScheduleSolution solution) {
        List<SectionDto> sections = new ArrayList<>();
        
        for(Section section : solution.getSections()) {
            List<MeetingDto> meetings = new ArrayList<>();
            for(Meeting meeting : section.getMeetings()) {
                meetings.add(new MeetingDto(
                    meeting.getDay().toString(), 
                    meeting.getStartTime().toString(), 
                    meeting.getEndTime().toString()));
            }
            sections.add(new SectionDto(section.getCourseCode(), section.getId(), meetings));
        }

        ScheduleStats st = solution.getStats();
        StatsDto stats = new StatsDto(
            st.getEarliestStart().toString(), 
            st.getLatestEnd().toString(), 
            st.getTotalGapMinutes(), 
            st.getDaysWithClasses());

        return new ScheduleDto(sections, stats, solution.getScore());
    }
}