import assert from "node:assert/strict";
import test from "node:test";
import { applyImportedCourses } from "../src/import/mapping/ImportedCourseMapper.ts";
import { CourseImportService } from "../src/import/service/CourseImportService.ts";

const service = new CourseImportService();

test("course-search text imports sections and infers visible lecture groups", () => {
  const text = `DATASCI 3000B - INTRO TO MACHINE LEARNING
Course Description: Basic principles of machine learning.
Class runs: 04-Jan-2027 to 09-Apr-2027
Component Section Class Nbr Instructor Days/Times/Location
LEC
  001  12287  G. Huang
  Tu  4:30 PM - 6:30 PM  WSC-55
LAB
  002  12288
  Th  4:30 PM - 6:30 PM  TC-141
LEC
  003  14341  P. Viswanathan
M  11:30 AM - 1:30 PM  SH-3345
LAB
  005  14390
  Tu  3:30 PM - 5:30 PM  ACEB-2415
LAB
  006  14391
  Th  11:30 AM - 1:30 PM  ACEB-2415`;

  const result = service.parse(text);
  const course = result.courses[0];

  assert.equal(result.format, "WESTERN_COURSE_SEARCH");
  assert.equal(result.issues.length, 0);
  assert.equal(course.code, "DATASCI 3000B");
  assert.deepEqual(course.components.map((component) => [component.type, component.sections.length]), [
    ["LEC", 2],
    ["LAB", 3],
  ]);
  assert.deepEqual(course.components[0].sections[0].meetings[0], {
    day: "TUESDAY",
    startTime: "16:30",
    endTime: "18:30",
  });
  assert.deepEqual(course.compatibilities[0].allowedPairs, [
    { firstSectionId: "001", secondSectionId: "002" },
    { firstSectionId: "003", secondSectionId: "005" },
    { firstSectionId: "003", secondSectionId: "006" },
  ]);
});

test("course-search text leaves combinations unrestricted when grouping is not visible", () => {
  const text = `TEST 1000B - SAMPLE COURSE
Course Description: Sample.
Class runs: 04-Jan-2027 to 09-Apr-2027
Component Section Class Nbr
LEC
001 10001
M 9:30 AM - 10:30 AM ROOM
LEC
002 10002
Tu 9:30 AM - 10:30 AM ROOM
LAB
003 10003
W 9:30 AM - 10:30 AM ROOM`;

  const result = service.parse(text);

  assert.equal(result.courses[0].compatibilities.length, 0);
});

test("draft-table text imports multiple courses and expands shared meeting days", () => {
  const text = `Subject Course Number Component Section Description Class Nbr Instructor Days/Times/Location
  ECE  3375B
LEC
  001  MICROPROCESSORS  9184  K. McIsaac
M  8:30 AM - 10:30 AM  UCC-56
W  3:30 PM - 4:30 PM  UCC-56
Runs From: 04-January-2027 To: 09-April-2027
  PHYSICS  2300B
LEC
  001  QUANTUM COMPUTATION  13304  A. Buchel
M W F  4:30 PM - 5:30 PM  AHB-1R40
Runs From: 04-January-2027 To: 09-April-2027`;

  const result = service.parse(text);

  assert.equal(result.format, "WESTERN_DRAFT_TABLE");
  assert.deepEqual(result.courses.map((course) => course.code), ["ECE 3375B", "PHYSICS 2300B"]);
  assert.equal(result.courses[0].components[0].sections[0].meetings.length, 2);
  assert.deepEqual(
    result.courses[1].components[0].sections[0].meetings.map((meeting) => meeting.day),
    ["MONDAY", "WEDNESDAY", "FRIDAY"],
  );
});

test("draft-table fragments work without the copied column heading", () => {
  const text = `DATASCI\t3000B
LEC
003\tINTRO TO MACHINE LEARNING\t14341\tP. Viswanathan
M\t11:30 AM - 1:30 PM\tSH-3345
Runs From: 04-January-2027 To: 09-April-2027
DATASCI\t3000B
LAB
006\tINTRO TO MACHINE LEARNING\t14391
Th\t11:30 AM - 1:30 PM\tACEB-2415
Runs From: 04-January-2027 To: 09-April-2027`;

  const result = service.parse(text);

  assert.equal(result.format, "WESTERN_DRAFT_TABLE");
  assert.equal(result.issues.length, 0);
  assert.equal(result.courses[0].code, "DATASCI 3000B");
  assert.deepEqual(result.courses[0].components.map((component) => [component.type, component.sections.length]), [
    ["LEC", 1],
    ["LAB", 1],
  ]);
});

test("enrollment tables import without dates and skip asynchronous courses", () => {
  const text = `Subject\tStatus\tCourse Number\tComponent\tSection\tDescription\tClass Nbr\tInstructor\tDays/Times/Location
ECE\tENROLLED\t2277A
LEC
002\tDIGITAL LOGIC SYSTEMS\t2712\tReyhani-Masoleh
M\t4:30 PM - 6:30 PM\tSEB-1200
F\t2:30 PM - 3:30 PM\tSEB-1059
0.50\tIn Person
ECE\tENROLLED\t2277A
TUT
004\tDIGITAL LOGIC SYSTEMS\t3357\tRao
Th\t8:30 AM - 9:30 AM\tSEB-1200
In Person
PHILOSOP\tENROLLED\t1230B
LEC
650\tREASONING & CRITICAL THINKING\t4307\tMendelovici
-
0.50\tDistance Studies/Online`;

  const result = service.parse(text);

  assert.equal(result.format, "WESTERN_DRAFT_TABLE");
  assert.equal(result.issues.some((issue) => issue.severity === "ERROR"), false);
  assert.deepEqual(result.courses.map((course) => course.code), ["ECE 2277A"]);
  assert.deepEqual(result.courses[0].components.map((component) => [component.type, component.sections.length]), [
    ["LEC", 1],
    ["TUT", 1],
  ]);
  assert.match(result.issues.map((issue) => issue.message).join(" "), /PHILOSOP 1230B was skipped/i);
});

test("course-search fragments use an entered course code when Western omits the heading", () => {
  const text = `Component\tSection\tClass Nbr\tInstructor\tRequisites and Constraints\tDays/Times/Location
LEC
001\t12287\tG. Huang
PRIORITY TO STATISTICS STUDENTS.
Tu\t4:30 PM - 6:30 PM\tWSC-55
0.50\tNot Full\t11\tMain\tIn Person\tSAVED
LAB
002\t12288
Th\t4:30 PM - 6:30 PM\tTC-141
Not Full\t11\tMain\tIn Person\tSAVED
LEC
003\t14341\tP. Viswanathan
RESTRICTED TO SE AND ECE ENGINEERING STUDENTS.
M\t11:30 AM - 1:30 PM\tSH-3345
0.50\tNot Full\t0\tMain\tIn Person\tSAVED
LAB
005\t14390
Tu\t3:30 PM - 5:30 PM\tACEB-2415
Not Full\t0\tMain\tIn Person\tSAVED
LAB
006\t14391
Th\t11:30 AM - 1:30 PM\tACEB-2415
Not Full\t0\tMain\tIn Person\tSAVED`;

  const result = service.parse(text, { fallbackCourseCode: "datasci 3000b" });

  assert.equal(result.format, "WESTERN_COURSE_SEARCH");
  assert.equal(result.issues.length, 0);
  assert.equal(result.courses[0].code, "DATASCI 3000B");
  assert.deepEqual(result.courses[0].components.map((component) => [component.type, component.sections.length]), [
    ["LEC", 2],
    ["LAB", 3],
  ]);
  assert.deepEqual(result.courses[0].compatibilities[0].allowedPairs, [
    { firstSectionId: "001", secondSectionId: "002" },
    { firstSectionId: "003", secondSectionId: "005" },
    { firstSectionId: "003", secondSectionId: "006" },
  ]);
});

test("bare component fragments are detected and explain when their course code is missing", () => {
  const text = `LEC
003\t14341\tP. Viswanathan
M\t11:30 AM - 1:30 PM\tSH-3345
LAB
006\t14391
Th\t11:30 AM - 1:30 PM\tACEB-2415`;

  const missingCode = service.parse(text);
  const withCode = service.parse(text, { fallbackCourseCode: "DATASCI 3000B" });

  assert.equal(missingCode.format, "WESTERN_COURSE_SEARCH");
  assert.match(missingCode.issues[0].message, /Enter the course code/i);
  assert.equal(withCode.courses[0].code, "DATASCI 3000B");
  assert.deepEqual(withCode.courses[0].components.map((component) => component.type), ["LEC", "LAB"]);
});

test("confirmed imports can merge, replace, or skip existing courses", () => {
  const existing = [{
    code: "TEST 1000B",
    components: [{
      type: "LEC" as const,
      enrollmentRequirement: "REQUIRED" as const,
      attendanceRequirement: "MANDATORY" as const,
      included: true,
      sections: [{ id: "001", meetings: [{ day: "MONDAY" as const, startTime: "09:00", endTime: "10:00" }] }],
    }],
    compatibilities: [],
  }];
  const imported = structuredClone(existing);
  imported[0].components[0].sections.push({
    id: "002",
    meetings: [{ day: "TUESDAY", startTime: "09:00", endTime: "10:00" }],
  });

  assert.equal(applyImportedCourses(existing, imported, { "TEST 1000B": "MERGE" })[0].components[0].sections.length, 2);
  assert.equal(applyImportedCourses(existing, imported, { "TEST 1000B": "SKIP" })[0].components[0].sections.length, 1);
});
