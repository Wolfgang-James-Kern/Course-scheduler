package com.wolfgangkern.coursescheduler.core.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Restricts which sections from two course components may be selected together.
 */
public final class ComponentCompatibility {
    private final ComponentType firstComponent;
    private final ComponentType secondComponent;
    private final List<SectionPair> allowedPairs;
    private final Set<SectionPair> allowedPairSet;

    /**
     * Creates a component compatibility restriction.
     *
     * @param firstComponent first component type
     * @param secondComponent second component type
     * @param allowedPairs allowed section pairs
     */
    public ComponentCompatibility(
        ComponentType firstComponent,
        ComponentType secondComponent,
        List<SectionPair> allowedPairs
    ) {
        if (firstComponent == null || secondComponent == null) {
            throw new IllegalArgumentException("Compatibility component types are required.");
        }
        if (firstComponent == secondComponent) {
            throw new IllegalArgumentException("Compatibility must relate two different component types.");
        }
        if (allowedPairs == null) {
            throw new IllegalArgumentException("Allowed section pairs are required.");
        }
        Set<SectionPair> uniquePairs = new HashSet<>(allowedPairs);
        if (uniquePairs.size() != allowedPairs.size()) {
            throw new IllegalArgumentException("Compatibility contains duplicate section pairs.");
        }
        this.firstComponent = firstComponent;
        this.secondComponent = secondComponent;
        this.allowedPairs = List.copyOf(allowedPairs);
        this.allowedPairSet = Set.copyOf(uniquePairs);
    }

    /**
     * Returns the first component type.
     *
     * @return first component type
     */
    public ComponentType getFirstComponent() {
        return firstComponent;
    }

    /**
     * Returns the second component type.
     *
     * @return second component type
     */
    public ComponentType getSecondComponent() {
        return secondComponent;
    }

    /**
     * Returns the allowed section pairs.
     *
     * @return immutable allowed-pair list
     */
    public List<SectionPair> getAllowedPairs() {
        return allowedPairs;
    }

    /**
     * Reports whether this restriction applies to two component types.
     *
     * @param first first component type
     * @param second second component type
     * @return true when this restriction relates the supplied types
     */
    public boolean appliesTo(ComponentType first, ComponentType second) {
        return firstComponent == first && secondComponent == second
            || firstComponent == second && secondComponent == first;
    }

    /**
     * Reports whether two sections form an allowed pair.
     *
     * @param first first selected section
     * @param second second selected section
     * @return true when the selected pair is allowed
     */
    public boolean allows(SelectedSection first, SelectedSection second) {
        if (first.componentType() == firstComponent && second.componentType() == secondComponent) {
            return allowedPairSet.contains(new SectionPair(first.id(), second.id()));
        }
        if (first.componentType() == secondComponent && second.componentType() == firstComponent) {
            return allowedPairSet.contains(new SectionPair(second.id(), first.id()));
        }
        return true;
    }
}
