import { useState } from "react";
import type { CourseIn, Day } from "../types";
import { format12h, toMinutes } from "./WeekGrid";

type Props = {
    value: CourseIn;
    onChange: (next: CourseIn) => void;
    onClear: () => void;
    onSubmit: () => void;
    submitLabel: string;
};

export default function CourseBuilder({value, onChange, onClear, onSubmit, submitLabel}: Props) {
    // Track which section is currently being edited (null = not editing any section)
    const [editingSection, setEditingSection] = useState<number | null>(null);
    // Temporary section data for the form
    const [tempSection, setTempSection] = useState<{id: string}>({id: ""});
    
    // Track which meeting is currently being edited
    const [editingMeeting, setEditingMeeting] = useState<{sectionIdx: number, meetingIdx: number | null} | null>(null);
    // Temporary meeting data for the form (mirrored from state when editing, fresh defaults when adding)
    const [tempMeeting, setTempMeeting] = useState<{day: Day, startTime: string, endTime: string}>({
        day: "MONDAY",
        startTime: "08:30",
        endTime: "09:30"
    });
    // Temporary meetings for new section
    const [tempMeetings, setTempMeetings] = useState<CourseIn["sections"][number]["meetings"]>([]);

    function updateSections(newSections: CourseIn["sections"]) {
        onChange({...value, sections: newSections});
    }

    function updateSection(idx: number, updater: (section: CourseIn["sections"][number]) => CourseIn["sections"][number]) {
        const sections = [...value.sections];
        sections[idx] = updater(sections[idx]);
        updateSections(sections);
    }

    function startAddSection() {
        setEditingSection(-1);  // Use -1 to indicate adding new section
        setEditingMeeting({sectionIdx: -1, meetingIdx: null});
        setTempSection({id: ""});
        setTempMeetings([]);
    }

    function editSection(idx: number) {
        setEditingSection(idx);
        setTempSection({id: value.sections[idx].id});
    }

    function saveSection() {
        if (editingSection === null) return;
        
        if (editingSection === -1) {
            // Add new section
            const newSection: CourseIn["sections"][number] = {
                id: tempSection.id,
                meetings: tempMeetings
            };
            updateSections([...value.sections, newSection]);
            setEditingSection(null);
            setEditingMeeting(null);

        } else {
            // Update existing section and then close the editor
            updateSection(editingSection, (section) => ({
                ...section,
                id: tempSection.id
            }));
            setEditingSection(null);
        }
    }

    function removeSection(idx: number) {
        updateSections(value.sections.filter((_, i) => i !== idx));
        // Clear meeting form if it was for this section
        if (editingMeeting?.sectionIdx === idx) {
            setEditingMeeting(null);
        }
    }

    function cancelEditSection() {
        setEditingSection(null);
        setEditingMeeting(null);
        setTempMeetings([]);
    }

    return (
        <div style = {{border: "1px solid black", borderRadius: 10, padding: 10, marginTop: 20}}>
            <div style = {{fontWeight: 800}}> Course Builder</div>
            <label>
                <div> Course Code</div>
                <input 
                value={value.code} 
                onChange={(e) => onChange({...value, code: e.target.value})} 
                placeholder="e.g. SE2205" 
                style= {{width: "100%", boxSizing: "border-box", padding: 10}}
                />
            </label>
            
            {/* Section Staging Area */}
            {editingSection !== null && (
                <div style={{border: "1px solid green", borderRadius: 10, padding: 10, marginBottom: 10, marginTop: 10, backgroundColor: "#f0fff0"}}>
                    <div style={{fontWeight: 700, marginBottom: 10}}>
                        {editingSection === -1 ? "Add New Section" : "Edit Section"}
                    </div>
                    
                    <label style={{display: "block", marginBottom: 10}}>
                        <div>Section ID</div>
                        <input 
                            value={tempSection.id} 
                            onChange={(e) => setTempSection({id: e.target.value})} 
                            placeholder="e.g. LEC001" 
                            style={{width: "100%", boxSizing: "border-box", padding: 10}}
                        />
                    </label>

                    {editingSection !== null && (
                        <>
                            {/* Meeting Staging Area */}
                            {editingMeeting && editingMeeting.sectionIdx === editingSection && (
                                <div style={{border: "1px solid blue", borderRadius: 10, padding: 10, marginTop: 10, marginBottom: 10, backgroundColor: "#f0f8ff"}}>
                                    <div style={{fontWeight: 700, marginBottom: 10}}>
                                        {editingMeeting.meetingIdx !== null ? "Edit Meeting" : "Add New Meeting"}
                                    </div>
                                    
                                    <div style={{display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap"}}>
                                        <select
                                            value={tempMeeting.day}
                                            onChange={(e) => setTempMeeting({...tempMeeting, day: e.target.value as Day})}
                                            style={{padding: 10}}
                                        >
                                            {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map((day) => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>

                                        <input
                                            type="time"
                                            value={tempMeeting.startTime}
                                            onChange={(e) => setTempMeeting({...tempMeeting, startTime: e.target.value})}
                                            style={{padding: 10}}
                                        />

                                        <input
                                            type="time"
                                            value={tempMeeting.endTime}
                                            onChange={(e) => setTempMeeting({...tempMeeting, endTime: e.target.value})}
                                            style={{padding: 10}}
                                        />
                                    </div>

                                    <div style={{display: "flex", gap: 10}}>
                                        <button onClick={() => {
                                            if (!editingMeeting) return;
                                            const {sectionIdx, meetingIdx} = editingMeeting;
                                            
                                            if (sectionIdx === -1) {
                                                // For new section
                                                if (meetingIdx !== null) {
                                                    // Update existing temp meeting
                                                    const newTempMeetings = [...tempMeetings];
                                                    newTempMeetings[meetingIdx] = {...tempMeeting};
                                                    setTempMeetings(newTempMeetings);
                                                } else {
                                                    // Add new temp meeting
                                                    setTempMeetings([...tempMeetings, {...tempMeeting}]);
                                                }
                                            } else {
                                                // For existing section
                                                if (meetingIdx !== null) {
                                                    // Update existing meeting
                                                    updateSection(sectionIdx, (section) => {
                                                        const meetings = [...section.meetings];
                                                        meetings[meetingIdx] = {...tempMeeting};
                                                        return {...section, meetings};
                                                    });
                                                } else {
                                                    // Add new meeting to section
                                                    updateSection(sectionIdx, (section) => ({
                                                        ...section,
                                                        meetings: [...section.meetings, {...tempMeeting}]
                                                    }));
                                                }
                                            }
                                            setEditingMeeting(null);
                                        }}>
                                            {editingMeeting.meetingIdx !== null ? "Update Meeting" : "Save Meeting"}
                                        </button>
                                        <button onClick={() => setEditingMeeting(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(!editingMeeting || editingMeeting.sectionIdx !== editingSection) && (
                                <button onClick={()=> {
                                    setEditingMeeting({sectionIdx: editingSection, meetingIdx: null});
                                    setTempMeeting({day: "MONDAY", startTime: "08:30", endTime: "09:30"});
                                }} style={{marginTop: 10}}>
                                    Add Meeting
                                </button>
                            )}

                            {/* Temp Meetings List for new section */}
                            {editingSection === -1 && (
                                <div style={{marginTop: 10, marginBottom: 10}}>
                                    <div style={{fontWeight: 700, marginBottom: 5}}>
                                        Meetings <span style={{fontWeight: 600}}>({tempMeetings.length})</span>
                                    </div>

                                    {tempMeetings.length === 0 ? (
                                        <div style={{fontSize: 14, color: "#666", marginBottom: 10}}>
                                            No meetings yet.
                                        </div>
                                    ) : (
                                        tempMeetings.map((meeting, mIdx) => (
                                            <div key={mIdx} style={{border: "1px solid grey", borderRadius: 8, padding: 10, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                                <div style={{flex: 1}}>
                                                    <div><strong>{meeting.day}</strong></div>
                                                    <div style={{fontSize: 14, color: "#666"}}>
                                                        {format12h(toMinutes(meeting.startTime))} - {format12h(toMinutes(meeting.endTime))}
                                                    </div>
                                                </div>
                                                <div style={{display: "flex", gap: 5}}>
                                                    <button onClick={() => {
                                                        setEditingMeeting({sectionIdx: -1, meetingIdx: mIdx});
                                                        setTempMeeting(tempMeetings[mIdx]);
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        setTempMeetings(tempMeetings.filter((_, i) => i !== mIdx));
                                                        if (editingMeeting && editingMeeting.sectionIdx === -1 && editingMeeting.meetingIdx === mIdx) {
                                                            setEditingMeeting(null);
                                                        }
                                                    }}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div style={{display: "flex", gap: 10}}>
                        <button onClick={saveSection}>
                            {editingSection === -1 ? "Save Section" : "Update Section"}
                        </button>
                        <button onClick={cancelEditSection}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style= {{fontWeight: 700, marginBottom: 10}}> Sections <span style={{fontWeight: 600}}>({value.sections.length})</span></div>

            {/* Saved Sections List */}
            {value.sections.length === 0 ? (
                <div style={{fontSize: 14, color: "#666", marginBottom: 10}}>
                    No sections yet.
                </div>
            ) : (
                value.sections.map((section, idx) => (
                    <div key={idx} style={{border: "1px solid gray", borderRadius: 10, padding: 10, marginBottom: 10}}>
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10}}>
                            <div>
                                <div style={{fontWeight: 700}}>Section ID</div>
                                <div style={{fontSize: 14}}>{section.id}</div>
                            </div>
                            <div style={{display: "flex", gap: 5}}>
                                <button onClick={() => editSection(idx)}>
                                    Edit
                                </button>
                                <button onClick={() => removeSection(idx)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                        {/* simplified meeting list */}
                        <div style={{marginBottom: 10}}>
                            {value.sections[idx].meetings.length === 0 ? (
                                <div style={{fontSize: 14, color: "#666", marginBottom: 10}}>
                                    No meetings yet.
                                </div>
                            ) : (
                                <ul style={{paddingLeft: 20}}>
                                    {value.sections[idx].meetings.map((meeting, mIdx) => (
                                        <li key={mIdx}>{meeting.day} {format12h(toMinutes(meeting.startTime))} - {format12h(toMinutes(meeting.endTime))}</li>
                                    ))}
                                </ul> 
                            )}
                        </div>
                    </div>
                ))
            )}
            {editingSection === null && (
                <button onClick={startAddSection}>
                    Add Section
                </button>
            )}

            
            <div style={{display: "flex", marginLeft: "auto"}}>
                <button onClick={onClear}>
                    Clear
                </button>

                <button onClick={onSubmit} style={{fontWeight: 800}}>
                    {submitLabel}
                </button>
            </div>
            

        </div>
    );
}