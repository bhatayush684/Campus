# Runtime Validation Report

**Target:** CampusMind
**Validation date:** 2026-11-05

## Summary

| Check | Result | Evidence |
|---|---|---|
| Frontend build | PASS | `npm run build` |
| Backend build | PASS | `server\npm run build` |
| Dependency audit | PASS | Frontend and backend production dependencies: 0 vulnerabilities |
| API smoke test | PASS | `SMOKE_BASE_URL=http://127.0.0.1:3001 npm run smoke` |
| Chat fallback/provider response | PASS | Response contained content and 5 sources |
| Invalid scraper URL | PASS | Rejected with HTTP 400 |
| Invalid crawl depth | PASS | Rejected with HTTP 400 |
| Lint | PASS with warnings | Existing React/style warnings only |
| Browser route validation | PASS | Chromium installed; live checks confirmed populated timetable grid and exam schedule cards |
| Timetable failure/empty states | PASS | API failure and no-match states now provide recovery guidance |
| Exam schedule filter recovery | PASS | Search/category/branch empty state now includes a reset action |

## Environment

- Node.js/npm: available
- Docker: not required for this validation; the application has no configured
  database dependency in the current implementation.
- Browser E2E: targeted browser validation was run against the local Vite server.
  The timetable rendered five weekly rows with populated cells; exam schedules
  rendered archived schedule cards and exposed the branch/category controls.

## Known limitations

- Live college scraping depends on the external sites being reachable with
  valid HTTPS certificates. Curated frontend data remains available when they
  are unavailable.
- Authentication, saved content, and administrative knowledge answers are
  currently local/demo persistence rather than a production database-backed
  identity system.
- The Vite bundle exceeds the default 500 kB warning threshold and should be
  route-split in a future performance pass.
- The bundled exam schedule records are historical reference data. No upcoming
  date is presented as current until a verified source provides one.
