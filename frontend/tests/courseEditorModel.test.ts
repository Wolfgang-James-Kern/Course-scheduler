import assert from "node:assert/strict";
import test from "node:test";
import { emptyComponent, emptyCourse, emptySection } from "../src/courseEditorModel.ts";

test("a new course starts with a component, section, and meeting", () => {
  const course = emptyCourse();

  assert.equal(course.components.length, 1);
  assert.equal(course.components[0].type, "LEC");
  assert.equal(course.components[0].sections.length, 1);
  assert.equal(course.components[0].sections[0].meetings.length, 1);
  assert.deepEqual(course.components[0].sections[0].meetings[0], {
    day: "MONDAY",
    startTime: "09:30",
    endTime: "10:30",
  });
});

test("a new component starts with a section and meeting", () => {
  const component = emptyComponent("LAB");

  assert.equal(component.sections.length, 1);
  assert.equal(component.sections[0].meetings.length, 1);
});

test("a new section starts with a meeting", () => {
  assert.equal(emptySection().meetings.length, 1);
});
