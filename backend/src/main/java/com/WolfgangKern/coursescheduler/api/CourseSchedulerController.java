package com.wolfgangkern.coursescheduler.api;

import java.time.DateTimeException;
import java.util.List;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wolfgangkern.coursescheduler.api.dto.SolveRequest;
import com.wolfgangkern.coursescheduler.api.dto.SolveResponse;
import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.ScheduleSolution;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.service.ScheduleSolver;

/**
 * Exposes schedule generation through the HTTP API.
 */
@RestController
@RequestMapping("/api")
public final class CourseSchedulerController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CourseSchedulerController.class);

    private final ScheduleSolver solver;
    private final ScheduleRequestMapper requestMapper;
    private final ScheduleResponseMapper responseMapper;
    private final ScheduleRequestComplexityValidator complexityValidator;

    /**
     * Creates the scheduling controller.
     *
     * @param solver scheduling application service
     * @param requestMapper request-to-domain mapper
     * @param responseMapper domain-to-response mapper
     * @param complexityValidator request cost validator
     */
    public CourseSchedulerController(
        ScheduleSolver solver,
        ScheduleRequestMapper requestMapper,
        ScheduleResponseMapper responseMapper,
        ScheduleRequestComplexityValidator complexityValidator
    ) {
        this.solver = solver;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
        this.complexityValidator = complexityValidator;
    }

    /**
     * Generates and ranks eligible schedules for one request.
     *
     * @param request courses, rules, and result limit
     * @return ranked schedules
     */
    @PostMapping(
        value = "/solve",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public SolveResponse solve(@Valid @RequestBody SolveRequest request) {
        long startedAt = System.nanoTime();
        complexityValidator.validate(request);
        List<Course> courses;
        List<RuleConfiguration> rules;
        try {
            courses = requestMapper.toCourses(request.courses());
            rules = requestMapper.toRules(request.rules());
        } catch (IllegalArgumentException | DateTimeException exception) {
            throw new InvalidScheduleRequestException("INVALID_REQUEST", exception.getMessage(), null);
        }
        List<ScheduleSolution> solutions = solver.solve(courses, rules, request.topN());
        long durationMilliseconds = (System.nanoTime() - startedAt) / 1_000_000;
        LOGGER.info(
            "Generated {} schedules from {} courses and {} rules in {} ms",
            solutions.size(),
            courses.size(),
            rules.size(),
            durationMilliseconds
        );
        return responseMapper.toResponse(solutions);
    }
}
