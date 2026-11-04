# CampusMind

CampusMind is a student-focused academic companion for Walchand College of
Engineering. It combines a React/Vite web application with an Express API,
grounded Gemini chat, syllabus-aware study planning, structured notes, notices,
exam schedules, documents, faculty information, placements, and timetable
views.

The application is designed to remain useful when external services are
unavailable: curated scraped datasets provide an offline-safe frontend
fallback, and the backend returns retrieved local content when Gemini cannot
answer.

## What is included

- **AI chat** — grounded answers based on the local WCE data corpus, with
  Markdown formatting, citations, source excerpts, Gemini/OpenAI provider
  fallback, and local retrieval fallback.
- **Study Plan** — department and exam-date planning based on syllabus units,
  estimated workload, priorities, active recall, practice, revision, daily
  targets, and completion tracking.
- **Notes Generator** — structured notes with syllabus mapping, learning order,
  exam-answer framework, self-tests, revision checklist, source status, and
  reference-date checks.
- **Academic data** — syllabus, notices, exam schedules, timetable, faculty,
  documents, departments, placements, events, and credit-system content.
- **User experience** — protected routes, role-aware dashboards, dark mode,
  command palette, responsive layouts, toast notifications, local persistence,
  and a global error boundary.
- **Deployment** — Docker, Docker Compose, Render Blueprint, and Vercel SPA
  routing configuration.

## Architecture

```text
Browser
  |
  | React 19 + Vite + React Router
  | Zustand stores + localStorage
  v
Frontend data layer (src/services/api.ts)
  |-- curated scraped JSON and public downloads
  |-- same-origin /api requests in production
  v
Express API (server/src)
  |-- /health
  |-- /api/chat/*
  |-- /api/data/*
  |-- /api/scraper/*
  |-- bounded scraper cache
  v
Walchand sources + Gemini API
```

### Supported source domains

The backend scraper is restricted to the configured Walchand domains:

- `https://walchandsangli.ac.in`
- `https://walchandsangli.com`
- `https://walchandsangli.in`

The `.com` domain must have working DNS before it can contribute data. The
scraper validates hostnames, limits crawl depth, limits the number of pages,
uses request timeouts, and never accepts arbitrary third-party URLs.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Git
- Docker Desktop for container deployment (optional)
- A Google Gemini API key for synthesized AI answers (optional locally, but
  recommended for full functionality)

## Local development

Install dependencies in both packages:

```powershell
npm install
Set-Location server
npm install
Set-Location ..
```

Create the backend environment file:

```powershell
Copy-Item server\env.example server\.env
```

Set at least:

```dotenv
GOOGLE_AI_API_KEY=your_key_here
GOOGLE_AI_MODEL=gemini-3-flash-preview,gemini-3.1-flash-lite
```

Keep `server/.env` private. It is ignored by Git. Never place an API key in
frontend source code, `vercel.json`, committed JSON, screenshots, or README
files.

Start the backend in one terminal:

```powershell
Set-Location server
npm run dev
```

Start the frontend in a second terminal:

```powershell
Set-Location ..
npm run dev
```

Open `http://localhost:5173`.

The Vite development server proxies `/api` requests to
`http://localhost:3001`. If the backend runs on another port, update the Vite
proxy configuration before development.

## Demo accounts

The current frontend uses local demo data for authentication:

| Role | Email | Password |
|---|---|---|
| Student | `student@wce.ac.in` | `demo123` |
| Faculty | `faculty@wce.ac.in` | `demo123` |
| Admin | `admin@wce.ac.in` | `demo123` |

These are demo accounts only. They are not production authentication.

## Environment variables

The backend reads environment variables from `server/.env` locally and from
the hosting provider in production.

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `PORT` | No | `3001` | Express listening port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `GOOGLE_AI_API_KEY` | Recommended | — | Gemini authentication |
| `GOOGLE_AI_MODEL` | No | `gemini-3-flash-preview,gemini-3.1-flash-lite` | Comma-separated fallback model chain |
| `OPENAI_API_KEY` | Optional fallback | — | OpenAI authentication; server-side only |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI fallback model |
| `CORS_ORIGIN` | Production | — | Comma-separated allowed browser origins |
| `WCE_BASE_URLS` | No | Three supported WCE domains | Scraper roots |
| `WCE_ALLOWED_HOSTS` | No | Empty | Comma-separated additional HTTPS hostnames to crawl only when explicitly verified as college-related |
| `SCRAPE_MAX_DEPTH` | No | `1` | Maximum crawl depth |
| `SCRAPE_MAX_PAGES` | No | `20` | Maximum pages crawled per configured source root |
| `SMOKE_BASE_URL` | No | `http://localhost:3001` | Base URL used by smoke tests |

## API endpoints

### Health and AI

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service readiness check |
| `GET` | `/api/chat/status` | Gemini/local provider status |
| `POST` | `/api/chat/message` | Grounded AI response; body: `{ "message": "..." }` |

### Structured data

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/data/notices` | Scraped and processed notices |
| `GET` | `/api/data/timetables` | Processed timetable data |
| `GET` | `/api/data/faculty` | Processed faculty data |
| `GET` | `/api/data/departments` | Processed department data |
| `GET` | `/api/scraper/status` | Scraper status |
| `POST` | `/api/scraper/scrape` | Trigger a configured scrape |
| `GET` | `/api/scraper/documents` | Discover downloadable source documents |

The data routes use a short-lived in-memory cache and a bounded refresh. If a
source site is slow or unavailable, the API returns the most recent snapshot
when available, or a valid empty structured response instead of hanging
indefinitely.

In production, set `CORS_ORIGIN` to the exact frontend origin(s); the server
does not permit arbitrary cross-origin requests. Scraping uses certificate
validation and HTTPS-only allowlisted sources. If an official source has an
invalid or incomplete certificate, live scraping is rejected and the
offline-safe curated data remains available.

## Production build and validation

Run the frontend build:

```powershell
npm run build
```

Run the backend build:

```powershell
Set-Location server
npm run build
Set-Location ..
```

Run lint:

```powershell
npm run lint
```

Lint currently reports warning-only legacy cleanup items. A successful
production build is the required type-check and bundling gate.

## Smoke testing

With the backend running:

```powershell
$env:SMOKE_BASE_URL = "http://localhost:3001"
npm run smoke
```

For a deployed service:

```powershell
$env:SMOKE_BASE_URL = "https://your-service.onrender.com"
npm run smoke
```

Smoke checks cover service health, AI status, and a grounded chat request.

## Docker deployment

Build and start the complete stack:

```powershell
$env:GOOGLE_AI_API_KEY = "your_key_here"
docker compose up --build -d
```

The default services are:

- Frontend/reverse proxy: `http://localhost`
- Backend health: `http://localhost/health`
- Backend container port: `3001`

Stop the stack:

```powershell
docker compose down
```

The production server image builds the frontend first, compiles the backend,
then runs the Express server. Nginx serves the SPA and proxies `/api` and
`/health`.

## Deploy to Render

This repository includes `render.yaml` for a single Docker web service.

1. Push the repository to GitHub.
2. In Render, choose **New → Blueprint**.
3. Select the repository and apply `render.yaml`.
4. Add `GOOGLE_AI_API_KEY` as a secret environment variable.
5. Confirm `CORS_ORIGIN` contains the real frontend origin.
6. Deploy and wait for `/health` to pass.

Verify:

```powershell
$env:SMOKE_BASE_URL = "https://your-service.onrender.com"
npm run smoke
```

Render free-tier services may sleep and may be slow on the first request.
The frontend should show loading and error states rather than assuming that a
source or AI request is always instant.

## Deploy the frontend to Vercel

The included `vercel.json`:

- rewrites `/api/*` to the Render API service;
- rewrites client-side routes such as `/app/chat` to `index.html`.

Recommended Vercel settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Root directory | Repository root |
| Build command | `npm run build` |
| Output directory | `dist` |

If the Render URL changes, update the API destination in `vercel.json` and
the Render `CORS_ORIGIN` value. Redeploy both services after changing either
value.

## Important data and date behavior

- Study plans reject past exam dates.
- Exam references are filtered against the current date before being shown as
  future references.
- Existing historical notices and exam records are not silently presented as
  current.
- Official dates should still be confirmed against the latest examination-cell
  notice.
- AI answers are instructed not to invent information absent from the local
  context.

## Project layout

```text
src/
  components/       Shared UI, layout, error boundary
  data/scraped/     Curated structured WCE datasets
  mock/             Demo users and local fallback records
  pages/            Route-level application pages
  router/           Public/protected route definitions
  services/         Frontend data and generation functions
  store/            Zustand state stores
  types/            Shared TypeScript types
server/
  src/routes/       Express API routes
  src/services/     RAG, scraping, and data processing
public/downloads/   Downloadable study resources
scripts/            Smoke and scraping utilities
deploy/             Nginx configuration
```

## Troubleshooting

### AI returns an error

1. Check `GET /api/chat/status`.
2. Confirm `GOOGLE_AI_API_KEY` exists in the Render environment, or configure
   `OPENAI_API_KEY` as a fallback secret.
3. Confirm the configured model is available to the key.
4. Inspect Render logs.
5. Retry with a specific course, notice, subject, or date.

The backend should still return local retrieved content when Gemini is
temporarily unavailable. If Gemini fails and `OPENAI_API_KEY` is configured,
the backend tries OpenAI before using local retrieval.

### Exposed or pasted API keys

Never paste API keys into source code, issues, chat, screenshots, or commits.
If a key has been shared, revoke it immediately, create a replacement, and
store the replacement only in `server/.env` locally or as a Render secret.

### Vercel route returns 404

Confirm `vercel.json` is deployed and that the route is a client-side route
such as `/app/chat`. Redeploy Vercel after changing rewrite rules.

### CORS errors

Set `CORS_ORIGIN` to the exact HTTPS frontend origin, without a trailing slash,
for example:

```dotenv
CORS_ORIGIN=https://your-project.vercel.app,https://your-service.onrender.com
```

### Scraped data is empty

Check source DNS and HTTPS availability. The `.com` domain cannot contribute
until its DNS resolves. Also check `SCRAPE_MAX_DEPTH`, Render request limits,
and the service logs.

### Build fails

Install dependencies in both the root and `server` directories, then run:

```powershell
npm run build
Set-Location server
npm run build
```

Do not commit `node_modules`, `dist`, `.env`, API keys, or generated secrets.

## Security and contribution rules

- Never commit credentials or tokens.
- Keep scraper host validation enabled.
- Validate user input at API boundaries.
- Preserve source citations and date warnings in grounded answers.
- Run frontend and backend builds before pushing.
- Keep changes focused and update this README when deployment behavior changes.

  ## contributer name and prn
- Ganesh Pralhad Bhutte  245109112
