package com.wolfgangkern.coursescheduler.api.protection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import jakarta.servlet.FilterChain;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

/**
 * Verifies solve endpoint rate and concurrency protection.
 */
@SpringBootTest
class SolveProtectionFilterTest {
    @Autowired
    private SolveProtectionFilter filter;

    /**
     * Verifies that one client is rejected after consuming its configured quota.
     *
     * @throws Exception when filter execution fails
     */
    @Test
    void rejectsRequestsAboveClientRateLimit() throws Exception {
        for (int index = 0; index < 6; index++) {
            MockHttpServletResponse response = executeSolve("192.0.2.10", (request, currentResponse) -> {});
            assertEquals(200, response.getStatus());
        }

        MockHttpServletResponse rejected = executeSolve("192.0.2.10", (request, response) -> {});

        assertEquals(429, rejected.getStatus());
        assertTrue(rejected.getContentAsString().contains("RATE_LIMIT_EXCEEDED"));
        assertTrue(Long.parseLong(rejected.getHeader(HttpHeaders.RETRY_AFTER)) > 0);
        assertEquals("no-store", rejected.getHeader(HttpHeaders.CACHE_CONTROL));
    }

    /**
     * Verifies that client quotas are independent.
     *
     * @throws Exception when filter execution fails
     */
    @Test
    void tracksDifferentClientsSeparately() throws Exception {
        for (int index = 0; index < 6; index++) {
            executeSolve("192.0.2.20", (request, response) -> {});
        }

        MockHttpServletResponse otherClient = executeSolve("192.0.2.21", (request, response) -> {});

        assertEquals(200, otherClient.getStatus());
    }

    /**
     * Verifies that health checks and browser preflight requests bypass solve protection.
     *
     * @throws Exception when filter execution fails
     */
    @Test
    void bypassesHealthAndPreflightRequests() throws Exception {
        MockHttpServletResponse health = execute("GET", "/api/health", "192.0.2.30", (request, response) -> {});
        MockHttpServletResponse preflight = execute("OPTIONS", "/api/solve", "192.0.2.30", (request, response) -> {});

        assertEquals(200, health.getStatus());
        assertEquals(200, preflight.getStatus());
    }

    /**
     * Verifies that work above the global solve limit is rejected and permits are later released.
     *
     * @throws Exception when concurrent filter execution fails
     */
    @Test
    void limitsConcurrentSolvesAndReleasesPermits() throws Exception {
        CountDownLatch entered = new CountDownLatch(2);
        CountDownLatch release = new CountDownLatch(1);
        FilterChain blockingChain = (request, response) -> {
            entered.countDown();
            try {
                if (!release.await(5, TimeUnit.SECONDS)) {
                    throw new IllegalStateException("Timed out waiting to release test requests.");
                }
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("Interrupted while waiting to release test requests.", exception);
            }
        };
        ExecutorService executor = Executors.newFixedThreadPool(2);
        List<Future<MockHttpServletResponse>> activeRequests = new ArrayList<>();
        try {
            activeRequests.add(executor.submit(() -> executeSolve("192.0.2.40", blockingChain)));
            activeRequests.add(executor.submit(() -> executeSolve("192.0.2.41", blockingChain)));
            assertTrue(entered.await(5, TimeUnit.SECONDS));

            MockHttpServletResponse busy = executeSolve("192.0.2.42", (request, response) -> {});
            assertEquals(503, busy.getStatus());
            assertTrue(busy.getContentAsString().contains("SERVER_BUSY"));
            assertEquals("2", busy.getHeader(HttpHeaders.RETRY_AFTER));
        } finally {
            release.countDown();
            for (Future<MockHttpServletResponse> request : activeRequests) {
                assertEquals(200, request.get(5, TimeUnit.SECONDS).getStatus());
            }
            executor.shutdownNow();
        }

        MockHttpServletResponse afterRelease = executeSolve("192.0.2.43", (request, response) -> {});
        assertEquals(200, afterRelease.getStatus());
    }

    /**
     * Executes a protected solve request.
     *
     * @param clientAddress simulated client address
     * @param chain downstream filter chain
     * @return captured response
     * @throws Exception when filter execution fails
     */
    private MockHttpServletResponse executeSolve(String clientAddress, FilterChain chain) throws Exception {
        return execute("POST", "/api/solve", clientAddress, chain);
    }

    /**
     * Executes one request through the protection filter.
     *
     * @param method HTTP method
     * @param path servlet path
     * @param clientAddress simulated client address
     * @param chain downstream filter chain
     * @return captured response
     * @throws Exception when filter execution fails
     */
    private MockHttpServletResponse execute(
        String method,
        String path,
        String clientAddress,
        FilterChain chain
    ) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest(method, path);
        request.setServletPath(path);
        request.setRemoteAddr(clientAddress);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, chain);
        return response;
    }
}
