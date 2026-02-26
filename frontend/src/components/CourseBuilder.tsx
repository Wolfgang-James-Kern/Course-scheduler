import type { CourseIn, Day } from "../types";

type Props = {
    value: CourseIn;
    onChange: (next: CourseIn) => void;
    onClear: () => void;
    onSubmit: () => void;
    submitLabel: string;
};

export default function CourseBuilder({value, onChange, onClear, onSubmit, submitLabel}: Props) {
    function updateSection(idx: number, updater: (section: CourseIn["sections"][number]) => CourseIn["sections"][number]) {
        const sections = [...value.sections];
        sections[idx] = updater(sections[idx]);
        onChange({...value, sections});
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
            
            <div style= {{fontWeight: 700}}> Sections</div>
            {value.sections.map((section, idx) => (
                <div key={idx} style={{border: "1px solid gray", borderRadius: 10, padding: 10, marginBottom: 10}}>
                    <div style = {{display: "flex", alignItems: "end", gap: 25, marginBottom: 15}}>
                        <label style = {{flex: "1 1 200px"}}> 
                            <div> Section ID</div>
                            <input 
                            value={section.id} 
                            onChange={(e) => onChange({...value, sections: value.sections.map((s, i) => i === idx ? {...s, id: e.target.value} : s)})} 
                            placeholder="e.g. LEC001" 
                            style= {{width: "100%", padding: 10}}
                            />
                        </label>

                        <button onClick={() => {
                            const sections = value.sections.filter((_, i) => i !== idx);
                            onChange({...value, sections});
                        }}
                        > Remove Section
                        </button>
                    </div>

                    <div>
                        {section.meetings.map((meeting, mIdx) => (
                            <div key={mIdx} style={{ 
                                display: "flex", 
                                gap: 10, 
                                alignItems: "center",
                                flexWrap: "wrap"}}
                            >
                                    
                                <select
                                    value={meeting.day}
                                    onChange={(e) => {
                                        updateSection(idx, (section) => {
                                        const meetings = [...section.meetings];
                                        meetings[mIdx] = {...meetings[mIdx], day: e.target.value as Day};
                                        return {...section, meetings};
                                        });
                                    }}
                                    style={{padding: 10}}
                                >
                                    {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>

                                <input
                                    type="time"
                                    value={meeting.startTime}
                                    onChange={(e) => {
                                        updateSection(idx, (section) => {
                                            const meetings = [...section.meetings];
                                            meetings[mIdx] = {...meetings[mIdx], startTime: e.target.value};
                                            return {...section, meetings};
                                        });
                                    }}
                                    style={{padding: 10}}
                                />

                                <input
                                    type="time"
                                    value={meeting.endTime}
                                    onChange={(e) => {
                                        updateSection(idx, (section) => {
                                            const meetings = [...section.meetings];
                                            meetings[mIdx] = {...meetings[mIdx], endTime: e.target.value};
                                            return {...section, meetings};
                                        });
                                    }}
                                    style={{padding: 10}}
                                />

                                <button onClick={() => {
                                    updateSection(idx, (section) => {
                                        const meetings = section.meetings.filter((_, i) => i !== mIdx);
                                        return {...section, meetings};
                                    });
                                }}
                                > Remove
                                </button> 

                            </div>
                        ))}
                    </div>

                    <button onClick={() => {
                        updateSection(idx, (section) => ({
                            ...section, 
                            meetings: [...section.meetings, {day: "MONDAY", startTime: "08:30", endTime: "09:30"}]}));
                    }}> 
                        Add Meeting
                    </button>

                </div>
            ))}

            <div style={{display: "flex"}}>
                <button
                onClick={() =>
                    onChange({...value, sections: [...value.sections, {id: "", 
                        meetings: [{ day: "MONDAY", startTime: "08:30", endTime: "09:30"}]}]
                    })
                }>
                    Add Section
                </button>

                <div style={{marginLeft: "auto"}}>
                    <button onClick={onClear}>
                        Clear
                    </button>

                    <button onClick={onSubmit}>
                        {submitLabel}
                    </button>
                </div>

            </div>

        </div>
    );
}