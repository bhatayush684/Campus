import express from 'express';
import { dataService, ProcessedData } from '../services/data.service.js';
import { scraperService } from '../services/scraper.service.js';

const router = express.Router();
const CACHE_TTL_MS = 10 * 60 * 1000;
const SCRAPE_TIMEOUT_MS = 8 * 1000;
let cachedData: ProcessedData | null = null;
let cacheExpiresAt = 0;
let refreshPromise: Promise<ProcessedData> | null = null;

async function getProcessedData(): Promise<ProcessedData> {
  if (cachedData && cacheExpiresAt > Date.now()) return cachedData;
  if (refreshPromise) return refreshPromise;

  refreshPromise = Promise.race([
    scraperService.scrapeWalchandCollege(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Scrape exceeded ${SCRAPE_TIMEOUT_MS}ms`)), SCRAPE_TIMEOUT_MS);
    }),
  ])
    .then(scrapedData => {
      const processed = dataService.processData(scrapedData);
      cachedData = processed;
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
      return processed;
    })
    .catch(error => {
      console.error('Scraped data refresh failed:', error);
      return dataService.processData([]);
    })
    .finally(() => {
      refreshPromise = null;
    });

  if (cachedData) {
    refreshPromise.catch(error => console.error('Background scrape refresh failed:', error));
    return cachedData;
  }
  return refreshPromise;
}

/**
 * GET /api/data/notices
 * Get all notices
 */
router.get('/notices', async (req, res) => {
  try {
    const processed = await getProcessedData();
    res.json({ success: true, data: processed.notices });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch notices'
    });
  }
});

/**
 * GET /api/data/timetables
 * Get all timetables
 */
router.get('/timetables', async (req, res) => {
  try {
    const processed = await getProcessedData();
    res.json({ success: true, data: processed.timetables });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch timetables'
    });
  }
});

/**
 * GET /api/data/faculty
 * Get all faculty information
 */
router.get('/faculty', async (req, res) => {
  try {
    const processed = await getProcessedData();
    res.json({ success: true, data: processed.faculty });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch faculty data'
    });
  }
});

/**
 * GET /api/data/departments
 * Get all departments
 */
router.get('/departments', async (req, res) => {
  try {
    const processed = await getProcessedData();
    res.json({ success: true, data: processed.departments });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch departments'
    });
  }
});

export default router;
