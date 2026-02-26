import { useState } from "react";
import CourseBuilder from "./components/CourseBuilder";
import type {CourseIn, SolveRequest} from "./types";

function sampleRequest(): SolveRequest {
    return {
      "topN": 5,
      "constraints": {
          "earliestStart": "08:00",
          "latestEnd": "18:00",
          "maxGapMinutes": 30
      },
      "courses": [
          {
              "code": "CS101",
              "sections": [
                  {
                      "id": "001",
                      "meetings": [
                          {"day": "MONDAY", "startTime": "09:00", "endTime": "10:15"},
                          {"day": "WEDNESDAY", "startTime": "09:00", "endTime": "10:15"}
                      ]
                  },
                  {
                      "id": "002",
                      "meetings": [
                          {"day": "TUESDAY", "startTime": "11:00", "endTime": "12:15"},
                          {"day": "THURSDAY", "startTime": "11:00", "endTime": "12:15"}
                      ]
                  }
              ]
          },
          {
              "code": "MATH201",
              "sections": [
                  {
                      "id": "001",
                      "meetings": [
                          {"day": "MONDAY", "startTime": "10:30", "endTime": "11:45"},
                          {"day": "WEDNESDAY", "startTime": "10:30", "endTime": "11:45"}
                      ]
                  }
              ]
          }
      ]
    }
  }


function emptyDraft(): CourseIn {//see if i can make meetings empty too
    return {
        code: "",
        sections: [{id: "", meetings: [{day: "MONDAY", startTime: "08:30", endTime: "09:30"}]}]
    };
}

function emptyRequest(): SolveRequest {
    return {
        topN: 0,
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
      /** maybe validate that its in a 30 minute interval */
    }
  }
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

  function loadSample() {
    setReq(sampleRequest());
    setDraft(emptyDraft());
    setEditingIndex(null);
    setError("");
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

  return (
    <div style = {{width: "100vw", height: "100vh", padding: 20}}>
      <h1 style={{margin: 0}}>Course Scheduler</h1>
      <div>
        Build courses in the staging area, add them to the list, then generate schedules
      </div>

      {/* Responsive */}
      <div style = {{width: "100vw", height: "90%"}}>
        {/* Left Panel */}
        <div style={{width: "25%", float: "left"}}>

          {/* Constraints + Actions */}
          <div style = {{border: "1px solid black", borderRadius: 10, padding: 10}}>
            <div style = {{fontWeight: 800}}> Generate Settings</div>

            <div style = {{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
              <label>
                <div> Top N</div>
                <input type="number" min={1} style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Max Gap</div>
                <input type="number" min={0} style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Earliest</div>
                <input type="time" min={"08:00"} max={"23:00"} style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>

              <label>
                <div> Latest</div>
                <input type="time" min={"08:00"} max={"23:00"} style= {{width: "95%", boxSizing: "border-box", padding: 10}}/>
              </label>
            </div>

            <button onClick={loadSample}>
              Load sample
            </button>

            <button>
              Generate
            </button>

            {error && 
              (<div style={{marginTop: 10, padding: 10, background: "#fff3f3", border: "1 px solid #f1b0b0", borderRadius: 10}}> 
                <strong> Error:</strong> {error} 
              </div>)}

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
              <div key={index} style={{border: "1px solid black", borderRadius: 10, padding: 10, display:"flex", alignItems: "center"}}>
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

        </div>
        {/* Right Panel */}
        <div style={{width: "75%", float: "right"}}>
          <h2>Course List</h2>
        </div>
      </div>
    </div>
  );
}
