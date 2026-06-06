package com.wolfgangkern.coursescheduler.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.wolfgangkern.coursescheduler.core.rule.ScheduleRuleFactory;
import com.wolfgangkern.coursescheduler.core.service.ConflictDetector;
import com.wolfgangkern.coursescheduler.core.service.ScheduleAnalyzer;
import com.wolfgangkern.coursescheduler.core.service.ScheduleEvaluator;
import com.wolfgangkern.coursescheduler.core.service.ScheduleGenerator;
import com.wolfgangkern.coursescheduler.core.service.ScheduleSolver;
import com.wolfgangkern.coursescheduler.support.TestServices;

/**
 * Verifies the scheduling HTTP contract and structured validation responses.
 */
class CourseSchedulerControllerTest {
    private MockMvc mockMvc;

    /**
     * Creates a standalone controller with its production dependencies.
     */
    @BeforeEach
    void setUp() {
        ConflictDetector conflictDetector = new ConflictDetector();
        ScheduleSolver solver = new ScheduleSolver(
            new ScheduleGenerator(conflictDetector, TestServices.courseOptionGenerator(conflictDetector)),
            new ScheduleAnalyzer(),
            new ScheduleEvaluator(),
            new ScheduleRuleFactory()
        );
        mockMvc = MockMvcBuilders
            .standaloneSetup(new CourseSchedulerController(
                solver,
                new ScheduleRequestMapper(),
                new ScheduleResponseMapper(),
                new ScheduleRequestComplexityValidator()
            ))
            .setControllerAdvice(new ApiExceptionHandler())
            .build();
    }

    /**
     * Verifies that a hard rule removes a violating section through the JSON API.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void solvesConfiguredRuleRequest() throws Exception {
        String request = """
            {
              "topN": 5,
              "courses": [{
                "code": "CS 1010",
                "components": [{
                  "type": "LEC",
                  "enrollmentRequirement": "REQUIRED",
                  "attendanceRequirement": "MANDATORY",
                  "meetingFrequency": "OCCASIONAL",
                  "included": true,
                  "sections": [
                    {"id": "EARLY", "meetings": [{"day": "MONDAY", "startTime": "08:00", "endTime": "09:00"}]},
                    {"id": "LATE", "meetings": [{"day": "MONDAY", "startTime": "10:00", "endTime": "11:00"}]}
                  ]
                }]
              }],
              "rules": [{
                "type": "EARLIEST_START",
                "mode": "HARD",
                "importance": 3,
                "time": "09:00"
              }]
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.schedules.length()").value(1))
            .andExpect(jsonPath("$.schedules[0].sections[0].id").value("LATE"))
            .andExpect(jsonPath("$.schedules[0].sections[0].meetingFrequency").value("OCCASIONAL"))
            .andExpect(jsonPath("$.schedules[0].ruleEvaluations[0].satisfied").value(true));
    }

    /**
     * Verifies that section compatibility is mapped and enforced through the JSON API.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void enforcesComponentCompatibilityRequest() throws Exception {
        String request = """
            {
              "topN": 10,
              "courses": [{
                "code": "DATASCI 3000B",
                "components": [
                  {
                    "type": "LEC",
                    "sections": [
                      {"id": "001", "meetings": [{"day": "MONDAY", "startTime": "09:00", "endTime": "10:00"}]},
                      {"id": "003", "meetings": [{"day": "TUESDAY", "startTime": "09:00", "endTime": "10:00"}]}
                    ]
                  },
                  {
                    "type": "LAB",
                    "sections": [
                      {"id": "002", "meetings": [{"day": "WEDNESDAY", "startTime": "09:00", "endTime": "10:00"}]},
                      {"id": "005", "meetings": [{"day": "THURSDAY", "startTime": "09:00", "endTime": "10:00"}]}
                    ]
                  }
                ],
                "compatibilities": [{
                  "firstComponent": "LEC",
                  "secondComponent": "LAB",
                  "allowedPairs": [
                    {"firstSectionId": "001", "secondSectionId": "002"},
                    {"firstSectionId": "003", "secondSectionId": "005"}
                  ]
                }]
              }],
              "rules": []
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.schedules.length()").value(2));
    }

    /**
     * Verifies that invalid course input returns a useful bad-request response.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsCourseWithoutSections() throws Exception {
        String request = """
            {
              "topN": 5,
              "courses": [{"code": "CS 1010", "components": []}],
              "rules": []
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.field").value("courses[0].components"))
            .andExpect(jsonPath("$.message").value("Each course must contain at least one component."))
            .andExpect(jsonPath("$.path").value("/api/solve"));
    }

    /**
     * Verifies that non-mandatory attendance is returned but excluded from hard-rule evaluation.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void excludesNonMandatoryAttendanceFromRuleEvaluation() throws Exception {
        String request = """
            {
              "topN": 5,
              "courses": [{
                "code": "CS 1010",
                "components": [
                  {
                    "type": "LEC",
                    "enrollmentRequirement": "REQUIRED",
                    "attendanceRequirement": "NON_MANDATORY",
                    "included": true,
                    "sections": [{"id": "001", "meetings": [{"day": "MONDAY", "startTime": "08:00", "endTime": "09:00"}]}]
                  },
                  {
                    "type": "LAB",
                    "enrollmentRequirement": "REQUIRED",
                    "attendanceRequirement": "MANDATORY",
                    "included": true,
                    "sections": [{"id": "002", "meetings": [{"day": "MONDAY", "startTime": "10:00", "endTime": "11:00"}]}]
                  }
                ]
              }],
              "rules": [{
                "type": "EARLIEST_START",
                "mode": "HARD",
                "importance": 3,
                "time": "09:00"
              }]
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.schedules.length()").value(1))
            .andExpect(jsonPath("$.schedules[0].sections.length()").value(2))
            .andExpect(jsonPath("$.schedules[0].stats.earliestStart").value("10:00"))
            .andExpect(jsonPath("$.schedules[0].sections[0].attendanceRequirement").exists());
    }

    /**
     * Verifies result limits are rejected before scheduling starts.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsExcessiveResultLimit() throws Exception {
        String request = """
            {
              "topN": 51,
              "courses": [{
                "code": "CS 1010",
                "components": [{
                  "type": "LEC",
                  "sections": [{"id": "001", "meetings": [{"day": "MONDAY", "startTime": "09:00", "endTime": "10:00"}]}]
                }]
              }],
              "rules": []
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.field").value("topN"));
    }

    /**
     * Verifies malformed times receive a field-specific validation response.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsMalformedMeetingTime() throws Exception {
        String request = """
            {
              "topN": 5,
              "courses": [{
                "code": "CS 1010",
                "components": [{
                  "type": "LEC",
                  "sections": [{"id": "001", "meetings": [{"day": "MONDAY", "startTime": "25:00", "endTime": "10:00"}]}]
                }]
              }],
              "rules": []
            }
            """;

        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.field").value("courses[0].components[0].sections[0].meetings[0].startTime"));
    }

    /**
     * Verifies malformed JSON never exposes parser internals.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsMalformedJson() throws Exception {
        mockMvc.perform(post("/api/solve").contentType(MediaType.APPLICATION_JSON).content("{\"topN\":"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("MALFORMED_JSON"))
            .andExpect(jsonPath("$.message").value("The request body is not valid."));
    }

    /**
     * Verifies that the solve endpoint accepts only JSON request bodies.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsUnsupportedContentType() throws Exception {
        mockMvc.perform(post("/api/solve").contentType(MediaType.TEXT_PLAIN).content("not json"))
            .andExpect(status().isUnsupportedMediaType());
    }
}
