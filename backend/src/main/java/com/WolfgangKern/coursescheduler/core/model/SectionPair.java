package com.wolfgangkern.coursescheduler.core.model;

import java.util.Locale;

/**
 * Identifies one allowed pair of sections from two course components.
 *
 * @param firstSectionId section from the first component
 * @param secondSectionId section from the second component
 */
public record SectionPair(String firstSectionId, String secondSectionId) {
    /**
     * Creates a normalized section pair.
     *
     * @param firstSectionId section from the first component
     * @param secondSectionId section from the second component
     */
    public SectionPair {
        firstSectionId = requireSectionId(firstSectionId);
        secondSectionId = requireSectionId(secondSectionId);
    }

    /**
     * Requires a normalized section identifier.
     *
     * @param sectionId supplied section identifier
     * @return normalized section identifier
     */
    private static String requireSectionId(String sectionId) {
        if (sectionId == null || sectionId.isBlank()) {
            throw new IllegalArgumentException("Compatibility section identifiers are required.");
        }
        return sectionId.trim().toUpperCase(Locale.ROOT);
    }
}
