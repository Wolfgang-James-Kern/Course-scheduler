import { useMemo, useReducer, useState } from "react";
import { otherSemester, SEMESTERS, semesterLabel, type AcademicYearWorkspace } from "./academicYear.ts";
import CourseDrawer from "./components/CourseDrawer";
import Drawer from "./components/Drawer";
import PresetDrawer from "./components/PresetDrawer";
import RuleDrawer from "./components/RuleDrawer";
import ScheduleDetailsPanel from "./components/ScheduleDetailsPanel";
import WeekGrid from "./components/WeekGrid";
import { PRESETS } from "./data/examples";
import { useScheduleGeneration } from "./hooks/useScheduleGeneration.ts";
import { useWorkspacePersistence } from "./hooks/useWorkspacePersistence.ts";
import { loadCustomPresets, saveCustomPresets, type CustomPreset } from "./presetStorage";
import { defaultAcademicYearWorkspace } from "./requestDefaults";
import { ruleName } from "./ruleCatalog.ts";
import type { ScheduleOut } from "./types";
import { formatTime } from "./utils/time";
import {
  courseSaveConflict,
  createWorkspaceState,
  workspaceReducer,
  type WorkspaceState,
} from "./workspaceReducer";
import { loadWorkspace, migrateAcademicYearSettings } from "./workspaceStorage";
import styles from "./App.module.css";

const EMPTY_SCHEDULE: ScheduleOut = {
  sections: [],
  stats: { earliestStart: null, latestEnd: null, totalGapMinutes: 0, daysWithClasses: 0 },
  score: 0,
  ruleEvaluations: [],
};

function ScheduleIcon() {
  return (
    <span className={styles.navIcon} aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="11" rx="1.5" />
        <path d="M2 6.5h12M5.5 2v2.5M10.5 2v2.5" />
      </svg>
    </span>
  );
}

function CoursesIcon() {
  return (
    <span className={styles.navIcon} aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="M3 4.5h10M3 8h10M3 11.5h7" />
      </svg>
    </span>
  );
}

function RulesIcon() {
  return (
    <span className={styles.navIcon} aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="M8 2.5 13.5 8 8 13.5 2.5 8Z" />
      </svg>
    </span>
  );
}

function initialState(): WorkspaceState {
  return createWorkspaceState(loadWorkspace());
}

export default function App() {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, initialState);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(loadCustomPresets);
  const { activeSemester, topN, rules, semesters } = state;
  const semesterOneCourses = semesters.SEMESTER_1.courses;
  const semesterTwoCourses = semesters.SEMESTER_2.courses;
  const workspace = useMemo<AcademicYearWorkspace>(() => ({
    activeSemester,
    topN,
    rules,
    semesters: {
      SEMESTER_1: { courses: semesterOneCourses },
      SEMESTER_2: { courses: semesterTwoCourses },
    },
  }), [activeSemester, topN, rules, semesterOneCourses, semesterTwoCourses]);
  const persistenceStatus = useWorkspacePersistence(workspace);
  const { generateSemester, generateBothSemesters } = useScheduleGeneration(workspace, state, dispatch);
  const activeWorkspace = state.semesters[state.activeSemester];
  const activeCourses = activeWorkspace.courses;
  const schedules = activeWorkspace.response?.schedules ?? [];
  const selectedSchedule = schedules[activeWorkspace.selectedSchedule] ?? EMPTY_SCHEDULE;
  const ruleCount = state.rules.length;
  const hasGenerated = activeWorkspace.status === "complete" || schedules.length > 0;
  const isLoading = activeWorkspace.status === "loading";
  const showEmptyCta = !isLoading && (activeCourses.length === 0 || !hasGenerated);
  const scheduleNavActive = state.drawer === null || state.drawer === "schedule-details";
  const coursesNavActive = state.drawer === "courses";
  const rulesNavActive = state.drawer === "rules";
  const saveStatusLabel = persistenceStatus === "saved"
    ? "Saved on this device"
    : "Could not save on this device";

  function startFresh() {
    if (!window.confirm("Clear both semesters, shared rule changes, and all generated schedules?")) {
      return;
    }
    const workspace = defaultAcademicYearWorkspace();
    workspace.rules = [];
    dispatch({ type: "RESET_WORKSPACE", workspace });
  }

  function loadPreset(nextWorkspace: AcademicYearWorkspace) {
    dispatch({ type: "LOAD_WORKSPACE", workspace: migrateAcademicYearSettings(structuredClone(nextWorkspace)) });
    dispatch({ type: "CLOSE_DRAWER" });
  }

  function saveCustomPreset(label: string): boolean {
    const existing = customPresets.find((preset) => preset.label.toLowerCase() === label.toLowerCase());
    if (existing && !window.confirm(`Replace the saved preset “${existing.label}”?`)) {
      return false;
    }
    const preset: CustomPreset = {
      id: existing?.id ?? crypto.randomUUID(),
      label,
      workspace: structuredClone(workspace),
    };
    const nextPresets = existing
      ? customPresets.map((candidate) => candidate.id === existing.id ? preset : candidate)
      : [...customPresets, preset];
    if (!saveCustomPresets(nextPresets)) {
      dispatch({ type: "SET_SEMESTER_ERROR", semester: state.activeSemester, message: "Unable to save the preset on this device." });
      return false;
    }
    setCustomPresets(nextPresets);
    return true;
  }

  function deleteCustomPreset(preset: CustomPreset) {
    if (!window.confirm(`Delete the preset “${preset.label}”?`)) {
      return;
    }
    const nextPresets = customPresets.filter((candidate) => candidate.id !== preset.id);
    if (!saveCustomPresets(nextPresets)) {
      dispatch({ type: "SET_SEMESTER_ERROR", semester: state.activeSemester, message: "Unable to delete the preset from this device." });
      return;
    }
    setCustomPresets(nextPresets);
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>CS</span>
          <div>
            <strong>Course Scheduler</strong>
          </div>
        </div>

        <nav className={styles.workspaceNav} aria-label="Scheduler workspace">
          <button
            className={scheduleNavActive ? styles.activeNav : undefined}
            aria-current={scheduleNavActive ? "page" : undefined}
            onClick={() => dispatch({ type: "CLOSE_DRAWER" })}
          >
            <ScheduleIcon />
            Schedule
          </button>
          <button
            className={coursesNavActive ? styles.activeNav : undefined}
            aria-current={coursesNavActive ? "page" : undefined}
            onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "courses" })}
          >
            <CoursesIcon />
            Courses
            <small>{activeCourses.length}</small>
          </button>
          <button
            className={rulesNavActive ? styles.activeNav : undefined}
            aria-current={rulesNavActive ? "page" : undefined}
            onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "rules" })}
          >
            <RulesIcon />
            Rules
            <small>{ruleCount}</small>
          </button>
        </nav>

        <div className={styles.courseSummary}>
          <div className={styles.sidebarHeading}>
            <span>Your courses</span>
          </div>
          {activeCourses.length === 0 ? (
            <button className={styles.addCoursePrompt} onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "courses" })}>
              <strong>+ Add your first course</strong>
              <span>Include each available section</span>
            </button>
          ) : (
            <div className={styles.sidebarCourses}>
              {activeCourses.slice(0, 7).map((course, index) => (
                <button
                  type="button"
                  key={course.code}
                  aria-label={`Edit ${course.code}`}
                  onClick={() => dispatch({ type: "OPEN_COURSE_EDITOR", index })}
                >
                  <span>{course.code}</span>
                  <small>
                    {course.components.map((component) => component.type).join(" / ")} · {course.components.reduce((total, component) => total + component.sections.length, 0)} sections
                  </small>
                </button>
              ))}
              {activeCourses.length > 7 && <small>+ {activeCourses.length - 7} more</small>}
            </div>
          )}
        </div>

        <p className={styles.savedStatus} role={persistenceStatus === "failed" ? "alert" : "status"}>
          {persistenceStatus === "saved"
            ? "Changes are saved on this device."
            : "Changes could not be saved on this device."}
        </p>

        <div className={styles.mobileChrome}>
          <button
            type="button"
            className={styles.mobileCourseChip}
            onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "courses" })}
          >
            {activeCourses.length} courses
          </button>
          <p className={styles.mobileSaveStatus} role={persistenceStatus === "failed" ? "alert" : "status"}>
            {saveStatusLabel}
          </p>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.workspaceHeading}>
            <h1>Plan weeks that fit</h1>
            <div className={styles.semesterSwitcher} aria-label="Active semester">
              {SEMESTERS.map((semester) => (
                <button
                  className={semester === state.activeSemester ? styles.activeSemester : ""}
                  key={semester}
                  aria-pressed={semester === state.activeSemester}
                  onClick={() => dispatch({ type: "SWITCH_SEMESTER", semester })}
                >
                  {semesterLabel(semester)}
                  <small>{state.semesters[semester].courses.length}</small>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.presetsButton} onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "presets" })}>
              Presets
            </button>
            <button className={styles.resetButton} onClick={startFresh}>Start fresh</button>
            <button
              className={styles.generateBothButton}
              disabled={SEMESTERS.some((semester) => state.semesters[semester].status === "loading")}
              onClick={generateBothSemesters}
            >
              Generate both
            </button>
            <button
              className={styles.generateButton}
              disabled={activeWorkspace.status === "loading"}
              onClick={() => generateSemester(state.activeSemester)}
            >
              {activeWorkspace.status === "loading" ? "Generating…" : `Generate ${semesterLabel(state.activeSemester)}`}
            </button>
          </div>
        </header>

        {activeWorkspace.error && <div className={styles.errorBanner} role="alert">{activeWorkspace.error}</div>}
        {activeWorkspace.status === "complete" && schedules.length === 0 && (
          <div className={styles.infoBanner} role="status">
            No schedule satisfies the current required rules. Adjust a requirement or add more sections.
          </div>
        )}

        <section className={styles.resultHeader}>
          <div>
            <span className={styles.sectionLabel}>Generated schedules</span>
            <strong>
              {isLoading
                ? "Generating options…"
                : schedules.length > 0
                  ? `${schedules.length} options`
                  : showEmptyCta
                    ? "No schedules yet"
                    : "Ready when you are"}
            </strong>
          </div>
          <label className={styles.resultCount}>
            Return
            <select value={state.topN} onChange={(event) => dispatch({ type: "SET_RESULT_COUNT", count: Number(event.target.value) })}>
              {[3, 5, 10, 15].map((count) => <option key={count}>{count}</option>)}
            </select>
          </label>
        </section>

        <div className={styles.resultStrip} aria-label="Generated schedule options" aria-busy={isLoading}>
          {isLoading ? (
            [1, 2, 3].map((option) => (
              <div className={styles.resultSkeleton} key={option} aria-hidden="true">
                <span>Option</span>
                <strong>Calculating</strong>
                <small>Comparing campus days and gaps</small>
              </div>
            ))
          ) : schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <button
                className={index === activeWorkspace.selectedSchedule ? styles.selectedResult : ""}
                key={index}
                aria-selected={index === activeWorkspace.selectedSchedule}
                onClick={() => dispatch({ type: "SELECT_SCHEDULE", index })}
              >
                <span>Option {index + 1}</span>
                <strong>{schedule.score} pts</strong>
                <small>{schedule.stats.daysWithClasses} campus days · {Math.round(schedule.stats.totalGapMinutes / 6) / 10}h gaps</small>
              </button>
            ))
          ) : showEmptyCta ? (
            [1, 2, 3].map((option) => (
              <div className={styles.resultPlaceholder} key={option} aria-hidden="true">
                <span>Option {option}</span>
                <strong>—</strong>
                <small>No schedule yet</small>
              </div>
            ))
          ) : (
            [1, 2, 3].map((option) => (
              <div className={styles.resultPlaceholder} key={option} aria-hidden="true">
                <span>Option {option}</span>
                <strong>—</strong>
                <small>Waiting for results</small>
              </div>
            ))
          )}
        </div>

        <section className={styles.schedulePanel}>
          <div className={styles.scheduleToolbar}>
            <div>
              <span className={styles.sectionLabel}>Weekly view</span>
              <strong>
                {isLoading
                  ? "Building preview…"
                  : schedules.length
                    ? `Option ${activeWorkspace.selectedSchedule + 1}`
                    : "Schedule preview"}
              </strong>
            </div>
            <div className={styles.scheduleToolbarActions}>
              <div className={styles.scheduleStats}>
                <span><small>First class</small>{isLoading || showEmptyCta ? "—" : formatTime(selectedSchedule.stats.earliestStart)}</span>
                <span><small>Last class</small>{isLoading || showEmptyCta ? "—" : formatTime(selectedSchedule.stats.latestEnd)}</span>
                <span><small>Total gaps</small>{isLoading || showEmptyCta ? "—" : `${Math.round(selectedSchedule.stats.totalGapMinutes / 6) / 10} hr`}</span>
              </div>
              {schedules.length > 0 && (
                <button
                  className={styles.detailsButton}
                  onClick={() => dispatch({ type: "OPEN_DRAWER", drawer: "schedule-details" })}
                >
                  Course details
                </button>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className={styles.loadingPanel} role="status" aria-live="polite">
              Generating schedule options…
            </div>
          ) : showEmptyCta ? (
            <div className={styles.emptyPanel}>
              <strong>{activeCourses.length === 0 ? "Your week is empty" : "Ready to generate"}</strong>
              <p>
                {activeCourses.length === 0
                  ? "Add the courses you want to take, then generate ranked schedule options that fit your rules."
                  : "Generate schedules to compare campus days, gaps, and how well each option matches your preferences."}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (activeCourses.length === 0) {
                    dispatch({ type: "OPEN_DRAWER", drawer: "courses" });
                    return;
                  }
                  generateSemester(state.activeSemester);
                }}
              >
                {activeCourses.length === 0 ? "Add courses" : `Generate ${semesterLabel(state.activeSemester)}`}
              </button>
            </div>
          ) : schedules.length === 0 ? (
            <div className={styles.ghostGrid} aria-hidden="true" />
          ) : (
            <WeekGrid schedule={selectedSchedule} />
          )}
        </section>

        {schedules.length > 0 && (
          <section className={styles.scoreBreakdown}>
            <div>
              <span className={styles.sectionLabel}>Why this ranks here</span>
              <h2>Rule breakdown</h2>
              <p>Lower preference penalties produce a better-ranked schedule.</p>
            </div>
            <div className={styles.evaluationList}>
              {selectedSchedule.ruleEvaluations.length === 0 ? (
                <div className={styles.noEvaluations}>No rules were applied to this schedule.</div>
              ) : selectedSchedule.ruleEvaluations.map((evaluation, index) => (
                <article key={`${evaluation.type}-${index}`}>
                  <span
                    className={evaluation.satisfied ? styles.passIndicator : styles.penaltyIndicator}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{ruleName(evaluation.type)}</strong>
                    <small title={evaluation.explanation} className={styles.evaluationExplanation}>
                      {evaluation.explanation}
                    </small>
                  </div>
                  <b>
                    {evaluation.mode === "HARD"
                      ? (evaluation.satisfied ? "Passed" : "Failed")
                      : (evaluation.satisfied ? "Passed" : `+${evaluation.penalty} Penalty`)}
                  </b>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {state.drawer === "courses" && (
        <Drawer title={`${semesterLabel(state.activeSemester)} courses`} subtitle="Manage the sections the scheduler can choose." onClose={() => dispatch({ type: "CLOSE_DRAWER" })}>
          <CourseDrawer
            key={`${state.activeSemester}-${state.courseEditorIndex ?? "list"}`}
            semester={state.activeSemester}
            courses={activeCourses}
            otherSemesterCourses={state.semesters[otherSemester(state.activeSemester)].courses}
            initialEditingIndex={state.courseEditorIndex}
            onSave={(course, index, targetSemester) => {
              const conflict = courseSaveConflict(state, course, index, targetSemester);
              if (conflict) {
                dispatch({ type: "SET_SEMESTER_ERROR", semester: state.activeSemester, message: conflict });
                return false;
              }
              dispatch({ type: "SAVE_COURSE", course, index, targetSemester });
              return true;
            }}
            onRemove={(index) => dispatch({ type: "REMOVE_COURSE", index })}
            onMove={(index, targetSemester) => dispatch({ type: "MOVE_COURSE", index, targetSemester })}
            onSetSemesterCourses={(semester, courses) => dispatch({ type: "SET_SEMESTER_COURSES", semester, courses })}
          />
        </Drawer>
      )}

      {state.drawer === "rules" && (
        <Drawer title="Schedule rules" subtitle="Choose from the built-in catalog and decide what is required." onClose={() => dispatch({ type: "CLOSE_DRAWER" })}>
          <RuleDrawer
            rules={state.rules}
            onChange={(rules) => dispatch({ type: "SET_RULES", rules })}
          />
        </Drawer>
      )}

      {state.drawer === "presets" && (
        <Drawer title="Presets" subtitle="Load, save, and manage complete scheduling configurations." onClose={() => dispatch({ type: "CLOSE_DRAWER" })}>
          <PresetDrawer
            builtInPresets={PRESETS}
            currentWorkspace={workspace}
            presets={customPresets}
            onSave={saveCustomPreset}
            onLoad={loadPreset}
            onDelete={deleteCustomPreset}
          />
        </Drawer>
      )}

      {state.drawer === "schedule-details" && (
        <Drawer
          title={`${semesterLabel(state.activeSemester)} · Option ${activeWorkspace.selectedSchedule + 1}`}
          subtitle="The sections and meeting times selected for this schedule."
          onClose={() => dispatch({ type: "CLOSE_DRAWER" })}
        >
          <ScheduleDetailsPanel courses={activeCourses} schedule={selectedSchedule} />
        </Drawer>
      )}
    </div>
  );
}
