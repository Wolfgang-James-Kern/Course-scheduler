import type { ScheduleOut } from '../types';

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h*60+m;
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function format12h(totalMinutes: number): string {
    let h = Math.floor(totalMinutes/60);
    const m = totalMinutes%60;
    const ampm = h < 12 ? "AM" : "PM";
    h = h%12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`
}

export default function WeekGrid({ schedule }: { schedule: ScheduleOut }) {

    const dayStart = 8*60;
    const dayEnd = 23*60;

    const rowMinutes = 30;
    const rows = (dayEnd - dayStart)/rowMinutes;
    const rowHeight = 30;

    const blocks = schedule.sections.flatMap((section) =>
        section.meetings.map((meeting) => ({
            courseCode: section.courseCode,
            sectionId: section.id,
            day: meeting.day,
            start: meeting.startTime,
            end: meeting.endTime
        })));

    const gridTemplate = `90px repeat(5, minmax(0, 1fr))`;
    return (
        <div style = {{border: "1px solid lightgray", borderRadius: 10}}>
            {/* header */}
            <div style={{ display: "grid", gridTemplateColumns: gridTemplate}}>
                <div style={{padding: 10, borderRight:"1px solid lightgray", textAlign: "center", fontWeight: 700}}> Time </div>
                {days.map((days) => (
                    <div key={days} style={{padding: 10, borderRight:"1px solid lightgray", textAlign: "center", fontWeight: 700}}>
                        {days}
                    </div>
                ))}
            </div>

            {/* body */}
            <div style={{display: "grid", gridTemplateColumns: gridTemplate}}>
                {/* time rail, lines only */}
                <div style={{borderRight: "1px solid lightgray", height: rows*rowHeight, display: "flex", flexDirection: "column"}}>
                    {Array.from({length: rows}).map((_, i) => {
                        const t = dayStart + i*rowMinutes;

                        return(
                            <div key={i} 
                                style={{
                                height: rowHeight, 
                                borderTop: "1px solid lightgray",  
                                paddingTop: 4, 
                                fontSize: 12,
                                textAlign: "center"
                                }}>
                                {format12h(t)}
                            </div>
                        );
                    })}
                </div>

                {/* day columns */}
                {days.map((day) => (
                    <div key={day}
                        style={{
                            borderRight: "1px solid lightgray",
                            position: "relative", 
                            height: rows*rowHeight
                        }}>
                        {blocks.filter((block) => block.day === day).map((block, index) => {
                            const startMin = clamp(toMinutes(block.start), dayStart, dayEnd);
                            const endMin = clamp(toMinutes(block.end), dayStart, dayEnd);
                            const top = Math.round(((startMin - dayStart) / rowMinutes) * rowHeight);
                            const height = Math.round(((endMin- startMin) / rowMinutes) * rowHeight);
                            

                            return(
                                <div 
                                    key = {`${day} - ${block.courseCode} - ${block.sectionId} - ${index}`}
                                    style = {{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute", 
                                        top, 
                                        left: 10, 
                                        right: 10, 
                                        height, 
                                        border: "1px solid grey",
                                        borderRadius: 8,
                                        boxSizing: "border-box",
                                        fontSize: 12

                                    }}
                                    title = {`${block.courseCode} ${block.sectionId} ${block.start} ${block.end}`}
                                >
                                    <div style = {{textAlign: "center"}}>
                                        <div style ={{fontWeight: 800}}>
                                            {block.courseCode}
                                        </div>
                                        <div>
                                            {block.sectionId}
                                        </div>
                                        <div>
                                            {block.start}-{block.end}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}