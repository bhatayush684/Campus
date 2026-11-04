import express from 'express';
import { scraperService } from '../services/scraper.service.js';

const router = express.Router();
const MAX_CRAWL_DEPTH = 2;
const MAX_SEARCH_LIMIT = 20;
const OPERATION_TIMEOUT_MS = 15_000;

function requestString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function boundedInteger(value: unknown, fallback: number, min: number, max: number): number | null {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function withTimeout<T>(operation: Promise<T>): Promise<T> {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Scrape operation timed out')), OPERATION_TIMEOUT_MS)),
  ]);
}

function isClientInputError(error: unknown): boolean {
  return error instanceof TypeError
    || (error instanceof Error && error.message === 'Only the configured Walchand College domains are allowed');
}

/**
 * POST /api/scraper/scrape
 * Scrape a single URL
 */
router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body ?? {};

    if (!requestString(url)) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = await scraperService.scrapePage(url);
    res.json({ success: true, data });
  } catch (error) {
    res.status(isClientInputError(error) ? 400 : 500).json({
      error: isClientInputError(error) ? 'Invalid or unsupported URL' : 'Failed to scrape page'
    });
  }
});

/**
 * POST /api/scraper/crawl
 * Crawl an entire website
 */
router.post('/crawl', async (req, res) => {
  try {
    const { url, maxDepth } = req.body ?? {};

    if (!requestString(url)) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const depth = boundedInteger(maxDepth, 1, 0, MAX_CRAWL_DEPTH);
    if (depth === null) return res.status(400).json({ error: `maxDepth must be an integer from 0 to ${MAX_CRAWL_DEPTH}` });

    const data = await scraperService.crawlWebsite(url, depth);
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(isClientInputError(error) ? 400 : 500).json({
      error: isClientInputError(error) ? 'Invalid or unsupported URL' : 'Failed to crawl website'
    });
  }
});

/**
 * POST /api/scraper/search
 * Search the web
 */
router.post('/search', async (req, res) => {
  try {
    const { query, limit } = req.body ?? {};

    if (!requestString(query)) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const resultLimit = boundedInteger(limit, 5, 1, MAX_SEARCH_LIMIT);
    if (resultLimit === null) return res.status(400).json({ error: `limit must be an integer from 1 to ${MAX_SEARCH_LIMIT}` });

    const data = await scraperService.search(query, resultLimit);
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ 
      error: 'Search failed'
    });
  }
});

/**
 * GET /api/scraper/walchand
 * Scrape Walchand College website
 */
router.get('/walchand', async (req, res) => {
  try {
    const data = await withTimeout(scraperService.scrapeWalchandCollege());
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to scrape Walchand College website'
    });
  }
});

/**
 * GET /api/scraper/documents
 * Get all downloadable documents from WCE website
 */
router.get('/documents', async (req, res) => {
  try {
    const documents = await withTimeout(scraperService.getAllDownloadableDocuments());
    res.json({ success: true, data: documents, count: documents.length });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch documents'
    });
  }
});

export default router;
