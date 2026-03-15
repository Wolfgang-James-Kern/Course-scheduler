import { useState } from "react";
import CourseBuilder from "./components/CourseBuilder";
import type {CourseIn, SolveRequest, SolveResponse} from "./types";
import WeekGrid, { format12h, toMinutes } from "./components/WeekGrid";
import { solveSchedules } from "./api";
import {PRESETS} from "./data/examples";

function emptyDraft(): CourseIn {
    return {
        code: "",
        sections: []
    };
}

function emptyRequest(): SolveRequest {
    return {
        topN: 1,
        constraints: { earliestStart: "", latestEnd: "", maxGapMinutes: 0 },
        courses: []
    };
}

function validateCourse(course: CourseIn): string | null {
  if(!course.code.trim()) return "Course code is required.";
  if(!course.sections || course.sections.length === 0) return "At least one section is required.";
  for(const section of course.sections) {
    if(!section.id.trim()) return `Section id is required for course ${course.code}.`;
    if(!section.meetings || section.meetings.length === 0) return `Section ${course.code} ${section.id} needs at least one meeting.`;
    for(const meeting of section.meetings) {
      if(!isValidTime(meeting.startTime) || !isValidTime(meeting.endTime)) return `Bad time format in ${course.code} ${section.id}. Use HH:MM.`;
      if(meeting.endTime <= meeting.startTime) return `End time must be after start time in ${course.code} ${section.id}.`;
    }
  }
  return null;
}

function validateRequest(req: SolveRequest): string | null {
  if(req.courses.length <= 0) return "Must have at least one course"
  if (!req.topN || req.topN < 1) return "Top N must be at least 1.";
  const constraints = req.constraints;
  if (constraints?.earliestStart) {
    if (!isValidTime(constraints.earliestStart)) return "Earliest start must be a valid time (HH:MM).";
    if (constraints.earliestStart < "08:00" || constraints.earliestStart > "23:00") return "Earliest start must be between 08:00 and 23:00.";
  } else {
    return "Please enter a valid value for Earliest"
  }
  if (constraints?.latestEnd) {
    if (!isValidTime(constraints.latestEnd)) return "Latest end must be a valid time (HH:MM).";
    if (constraints.latestEnd < "08:00" || constraints.latestEnd > "23:00") return "Latest end must be between 08:00 and 23:00.";
  } else {
    return "Please enter a valid value for Latest"
  }
  if (constraints?.earliestStart && constraints?.latestEnd) {
    if (constraints.latestEnd <= constraints.earliestStart) return "Latest end must be after earliest start.";
  }
  if (constraints?.maxGapMinutes !== undefined && constraints.maxGapMinutes < 0) return "Max gap minutes must be non-negative.";
  return null;
}

function isValidTime(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

export default function App() {
  const [draft, setDraft] = useState<CourseIn>( () => {
    const saved = localStorage.getItem("draft");
    return saved ? JSON.parse(saved) : emptyDraft();
  });

  const [req, setReq] = useState<SolveRequest>( () => {
    const saved = localStorage.getItem("request");
    return saved ? JSON.parse(saved) : emptyRequest();
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<SolveResponse | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [presetIndex, setPresetIndex] = useState<number | null>(null);

  const emptySchedule = {
    sections: [],
    stats: {earliestStart: "", latestEnd: "", totalGapMinutes: 0, daysWithClasses: 0},
    score: 0
  }

  const schedules = response?.schedules ?? [];

  function loadSample(index: number) {
    setReq(PRESETS[index].request);
    setDraft(emptyDraft());
    setEditingIndex(null);
    setError("");
    setPresetIndex(index);
  }

  function clearDraft() {
    setDraft(emptyDraft());
    setEditingIndex(null);
  }

  function saveCourse() {
    setError("");
    const validate = validateCourse(draft)
    if(validate) {
      setError(validate);
      return;
    }
  
    const normalized: CourseIn = {
      ...draft,
      code: draft.code.trim(),
      sections: draft.sections.map((s) => ({...s, id: s.id.trim(),
        meetings: s.meetings.map((m) => ({...m, startTime: m.startTime.trim(), endTime: m.endTime.trim()}))
      }))
    };

    setReq((prev) => {
      const courses = [...prev.courses];
      if (editingIndex === null) {
        // add to TOP
        return { ...prev, courses: [normalized, ...courses] };
      } else {
        courses[editingIndex] = normalized;
        return { ...prev, courses };
      }
    });

    clearDraft();
  }

  function editCourse(index: number) {
    setError("");
    setEditingIndex(index);
    setDraft(req.courses[index]);
  }

  function removeCourse(index: number) {
    setReq((prev) => ({ ...prev, courses: prev.courses.filter((_, i) => i !== index) }));
    if (editingIndex === index) clearDraft();
  }

  async function runSolve() {
    setError("");
    const validate = validateRequest(req);
    if (validate) {
      setError(validate);
      return;
    }
    try{
      const data = await solveSchedules(req);
      setResponse(data)
    }catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  }

  return (
    <div style = {{width: "100vw", height: "100vh", padding: 20, boxSizing: "border-box"}}>
      <h1 style={{margin: 0}}>Course Scheduler</h1>
      <div>
        Build courses in the staging area, add them to the list, then generate schedules
      </div>

      {/* Responsive */}
      <div style = {{width: "100%", display: "flex"}}>
        {/* Left Panel */}
        <div style={{width: "25%", height: "100%"}}>

          {/* Constraints + Actions */}
          <div style = {{border: "1px solid black", borderRadius: 10, padding: 10}}>
            <div style = {{fontWeight: 800}}> Generate Settings</div>

            <div style = {{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
              <label>
                <div> Top N</div>
                <input type="number" 
                  min={1} 
                  value={req.topN}
                  onChange={ (e) => setReq((p)=> ({ ...p, topN: Number(e.target.value)}))}
                  style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Max Gap</div>
                <input type="number" 
                  min={0} 
                  value={req.constraints?.maxGapMinutes ?? ""}
                  onChange={ (e) => setReq((p)=> ({ ...p, 
                    constraints: {...(p.constraints ?? {}), maxGapMinutes: e.target.value === "" ? undefined : Number(e.target.value)}
                  }))}
                  style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Earliest</div>
                <input type="time" 
                  min={"08:00"} max={"23:00"} 
                  value={req.constraints?.earliestStart ?? ""}
                  onChange={(e) => setReq((p) => ({ ...p,
                    constraints: { ...(p.constraints ?? {}), earliestStart: e.target.value || undefined }
                  }))}
                  style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Latest</div>
                <input type="time" 
                  min={"08:00"} max={"23:00"} 
                  value={req.constraints?.latestEnd ?? ""}
                  onChange={(e) => setReq((p) => ({ ...p,
                    constraints: { ...(p.constraints ?? {}), latestEnd: e.target.value || undefined }
                  }))}
                  style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>
            </div>

            <div style={{marginTop: 10}}>
              <select
                value={presetIndex === null ? "" : presetIndex}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setPresetIndex(null);
                    setReq(emptyRequest());
                  } else {
                    const idx = Number(val);
                    setPresetIndex(idx);
                    loadSample(idx);
                  }
                }}
                style={{ marginRight: 10, padding: 10 }}
              >
                <option value="">
                  Presets
                </option>
                {PRESETS.map((p, i) => (
                  <option key={i} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>

              <button onClick={runSolve}>
                Generate
              </button>

              {error && 
                (<div style={{marginTop: 10, padding: 10, background: "#fff3f3", border: "1 px solid #f1b0b0", borderRadius: 10}}> 
                  <strong> Error:</strong> {error} 
                </div>)}
            </div>
          </div>


          {/* Staging Area */}
          <CourseBuilder 
          value={draft} 
          onChange={setDraft}
          onClear={clearDraft}
          onSubmit={saveCourse}
          submitLabel = {editingIndex === null ? "Add Course" : "Save Changes"}/>

          {/* Course list */}
          <div style={{border: "1px solid black", borderRadius: 10, padding: 10, marginTop: 20}}>
            <div style={{fontWeight: 800}}>
              Added Courses <span style={{fontWeight: 600 }}>({req.courses.length})</span>
            </div>

            {req.courses.length === 0 && <div> No courses yet. Use the Course Builder above.</div>}

            {req.courses.map((course, index) => (
              <div key={index} style={{border: "1px solid gray", borderRadius: 10, padding: 10, display:"flex", alignItems: "center"}}>
                <div>
                  <div style={{fontWeight: 900}}>
                    {course.code}
                  </div>
                  <div>
                    {course.sections.length} section(s)
                  </div>
                </div>

                <div style={{marginLeft: "auto"}}>
                  <button onClick={()=> editCourse(index)}>
                    Edit
                  </button>
                  <button onClick={()=> removeCourse(index)}>
                    Remove
                  </button>
                </div>
                
              </div>
            ))}

          </div>

          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer" }}>Debug: request JSON</summary>
            <pre style={{ background: "#fafafa", padding: 12, borderRadius: 10, overflowX: "auto" }}>
              {JSON.stringify(req, null, 2)}
            </pre>
          </details>

        </div>
        {/* Right Panel */}
        <div style={{width: "75%", border: "1px solid black", borderRadius: 10, padding: 10, marginLeft: 20}}>
          
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div style={{fontWeight: 900}}>Results</div>
            <div>{response && response.schedules ? `${response.schedules.length} schedule(s)`: "No results yet"}</div>
          </div>

          {/* schedule picker */}
          <div style={{display: "flex", marginTop: 10, gap: 10, overflowX: "auto", flexWrap: "nowrap"}}>
            {schedules.length>0 ? schedules.map((s, i) => (
              <button 
              key={i} 
              onClick={() => setSelected(i)}
              style = {{
                flex: "0 0 240px",
                textAlign: "left",
                marginBottom: 12,
                padding: 10,
                borderRadius: 10,
                border: i === selected ? "2px solid #444" : "1px solid #ddd",
                background: i === selected ? "#f2f2f2" : "white"
              }}
              >
                <div style={{fontWeight: 900}}>#{i+1}</div>
                <div style={{ fontSize: 12, color: "#555" }}>Score: {s.score}</div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  {format12h(toMinutes(s.stats.earliestStart))}-{format12h(toMinutes(s.stats.latestEnd))} • gaps {s.stats.totalGapMinutes/60}h • days {s.stats.daysWithClasses}
                </div>
              </button>
            )): [0, 1, 2].map((i) => (
          <button
            key={i}
            disabled
            style={{
              flex: "0 0 240px",
              textAlign: "left",
              padding: 10,
              borderRadius: 10,
              border: "1px dashed #ccc",
              color: "#888",
              cursor: "default"
            }}
          >
                <div>#{i+1}</div>
                <div>Generate to fill</div>
              </button>
            ))}
          </div>

          {/* grid preview */}
          <div>
            {schedules.length>0 && schedules[selected] ? (
              <div>
                <strong>Selected:</strong> #{selected+1} • Score {schedules[selected].score}
              </div>
            ) : (
              <div>
                Generate schedules to populate the grid
              </div>
            )}
            <WeekGrid schedule = {schedules.length>0 && schedules[selected] ? schedules[selected] : emptySchedule} />
          </div>
        </div>
      </div>
    </div>
  );
}
