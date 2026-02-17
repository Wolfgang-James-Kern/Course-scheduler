import { useState } from "react";

export default function App() {
  const [result, setResult] = useState<string>("");

  async function testSolve() {
    const body = {
      topN: 5,
      constraints: {earliestStart: "09:30", latestEnd: "17:00", maxGap: 120},
      courses: []
    };

    const res = await fetch("/api/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setResult(JSON.stringify(json, null, 2));
  }

  return (
    <div>
      <button onClick={testSolve}>Test Solve</button>
      <pre>{result}</pre>
    </div>
  );
}
