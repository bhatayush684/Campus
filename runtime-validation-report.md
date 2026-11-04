# Runtime Validation Report

**Target:** CampusMind
**Validation date:** 2026-11-05

## Summary

| Check | Result | Evidence |
|---|---|---|
| Frontend build | PASS | `npm run build` |
| Backend build | PASS | `server\npm run build` |
| Dependency audit | PASS | Frontend and backend production dependencies: 0 vulnerabilities |
| API smoke test | PASS | `npm run smoke` against `http://localhost:3001` |
| Chat fallback/provider response | PASS | Response contained content and 5 sources |
| Invalid scraper URL | PASS | Rejected with HTTP 400 |
| Invalid crawl depth | PASS | Rejected with HTTP 400 |
| Lint | PASS with warnings | Existing React/style warnings only |

## Environment

- Node.js/npm: available
- Docker: not required for this validation; the application has no configured
  database dependency in the current implementation.
- Browser E2E: not run in this pass; API, build, and route-level validation were
  executed.

## Known limitations

- Live college scraping depends on the external sites being reachable with
  valid HTTPS certificates. Curated frontend data remains available when they
  are unavailable.
- Authentication, saved content, and administrative knowledge answers are
  currently local/demo persistence rather than a production database-backed
  identity system.
- The Vite bundle exceeds the default 500 kB warning threshold and should be
  route-split in a future performance pass.
