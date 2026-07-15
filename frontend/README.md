# Course Scheduler Frontend

The React frontend provides a two-semester, grid-centered schedule workspace, component-based course editing, semester-aware Western text import, registration and attendance controls, editable section compatibility, built-in rule configuration, persisted academic-year state, result comparison, and rule-score explanations.

## Commands

```powershell
npm run dev
npm test
npm run lint
npm run build
```

During local development, Vite proxies `/api` to `http://localhost:8080`.
Run `npm run test:integration` while the backend is running to verify every bundled preset against the real API.
