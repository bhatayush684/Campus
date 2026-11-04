# CampusMind

CampusMind is a React/Vite college companion with notices, syllabus,
documents, schedules, and a grounded AI chat assistant for Walchand College
of Engineering.

## Development

Install dependencies in both packages:

```powershell
npm install
Set-Location server
npm install
```

Configure the backend by copying `server/env.example` to `server/.env` and
setting `GOOGLE_AI_API_KEY`. Keep `server/.env` local; it is ignored by Git. The
default model chain is `gemini-3-flash-preview,gemini-3.1-flash-lite`.

Run the API and frontend in separate terminals:

```powershell
Set-Location server
npm run dev
```

```powershell
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to
the API at `http://localhost:3001`.

## Production checks

```powershell
npm run build
Set-Location server
npm run build
```

The chat service retrieves relevant local content first and asks Gemini to
synthesize a cited answer. If Gemini is temporarily unavailable, it returns
the retrieved local excerpts instead.

## Deployment with Docker

Docker and Docker Compose are required on the deployment host. Set the API
key in the host environment; do not commit it:

```powershell
$env:GOOGLE_AI_API_KEY = "your-key"
docker compose up --build -d
```

The web application is then available at `http://localhost` (or the port
selected with `WEB_PORT`). Nginx serves the SPA and proxies `/api` and
`/health` to the API container. Check deployment health with:

```powershell
curl http://localhost/health
npm run smoke
```

For a non-Docker host, run `npm run build` in the root package and
`npm run build && npm start` in `server`; place the generated `dist` behind
an HTTPS reverse proxy that forwards `/api` and `/health` to port 3001.
