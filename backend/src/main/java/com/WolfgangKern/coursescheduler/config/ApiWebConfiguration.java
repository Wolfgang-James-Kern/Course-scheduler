package com.wolfgangkern.coursescheduler.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures browser access to the scheduling API.
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(ApiProtectionProperties.class)
public class ApiWebConfiguration {
    /**
     * Restricts cross-origin API requests to configured frontend origins.
     *
     * @param properties API protection configuration
     * @return MVC CORS configuration
     */
    @Bean
    public WebMvcConfigurer apiCorsConfigurer(ApiProtectionProperties properties) {
        return new WebMvcConfigurer() {
            /**
             * Registers the API CORS policy.
             *
             * @param registry CORS mapping registry
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(properties.allowedOrigins().toArray(String[]::new))
                    .allowedMethods("GET", "POST", "OPTIONS")
                    .allowedHeaders("Content-Type")
                    .allowCredentials(false)
                    .maxAge(3600);
            }
        };
    }
}
