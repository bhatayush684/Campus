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
setting `GOOGLE_AI_API_KEY`. Keep `server/.env` local; it is ignored by Git.

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
