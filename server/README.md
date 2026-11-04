# CampusMind API

## Run locally

1. Copy `env.example` to `.env`.
2. Set `GOOGLE_AI_API_KEY` to a Google AI Studio API key.
3. Optionally set `GOOGLE_AI_MODEL`; the default is
   `gemini-3-flash-preview,gemini-3.1-flash-lite`.
4. Optionally set `OPENAI_API_KEY` and `OPENAI_MODEL` to enable an OpenAI
   fallback. Store both only in environment variables.
4. Set `WCE_BASE_URLS` to the comma-separated official sites
   (`walchandsangli.ac.in`, `walchandsangli.com`, and `walchandsangli.in`) and adjust
   `SCRAPE_MAX_DEPTH` (default `1`) to control crawl cost.
5. Run `npm install` and `npm run dev` from this directory.

The API listens on `http://localhost:3001`. The Vite development server proxies
frontend `/api` requests to it.

The chat endpoint retrieves relevant documents from `public/scraped` and
`public/downloads`, then uses Gemini to synthesize a grounded response. If the
provider is unavailable, it tries the optional OpenAI provider and then returns
the retrieved excerpts instead.
