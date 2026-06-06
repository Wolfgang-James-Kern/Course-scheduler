package com.wolfgangkern.coursescheduler.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Verifies browser-origin restrictions for the API.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ApiWebConfigurationTest {
    @Autowired
    private MockMvc mockMvc;

    /**
     * Verifies that the configured local frontend origin can call the API.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void allowsConfiguredOrigin() throws Exception {
        mockMvc.perform(options("/api/solve")
            .header("Origin", "http://localhost:5173")
            .header("Access-Control-Request-Method", "POST")
            .header("Access-Control-Request-Headers", "Content-Type"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
            .andExpect(header().doesNotExist("Access-Control-Allow-Credentials"));
    }

    /**
     * Verifies that an unknown browser origin is rejected.
     *
     * @throws Exception when request execution fails
     */
    @Test
    void rejectsUnknownOrigin() throws Exception {
        mockMvc.perform(options("/api/solve")
            .header("Origin", "https://untrusted.example")
            .header("Access-Control-Request-Method", "POST"))
            .andExpect(status().isForbidden())
            .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
