package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Represents one selectable section in a schedule request.
 *
 * @param id section identifier
 * @param meetings section meetings
 */
public record SectionRequestDto(
    @NotBlank(message = "Section identifier is required.")
    @Size(max = 40, message = "Section identifier cannot exceed 40 characters.")
    String id,
    @NotEmpty(message = "Each section must contain at least one meeting.")
    @Size(max = 10, message = "A section can contain at most 10 meetings.")
    List<@Valid MeetingDto> meetings
) {}
