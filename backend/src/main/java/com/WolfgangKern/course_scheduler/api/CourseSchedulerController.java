package com.WolfgangKern.course_scheduler.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WolfgangKern.course_scheduler.api.dto.SolveRequest;
import com.WolfgangKern.course_scheduler.api.dto.SolveResponse;

@RestController
@RequestMapping("/api")//base path for all endpoints in this controller
public class CourseSchedulerController {
    
    public String home() {
        return "Welcome to the Course Scheduler!";
    }

    @PostMapping("/solve")//endpoint for solving the schedules, takes in a SolveRequest object and returns a SolveResponse object
    public SolveResponse solve(@RequestBody SolveRequest request) {
        return new SolveResponse();
    }
}