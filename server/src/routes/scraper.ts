import express from 'express';
import { scraperService } from '../services/scraper.service.js';

const router = express.Router();

/**
 * POST /api/scraper/scrape
 * Scrape a single URL
 */
router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = await scraperService.scrapePage(url);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to scrape page',
      message: error.message 
    });
  }
});

/**
 * POST /api/scraper/crawl
 * Crawl an entire website
 */
router.post('/crawl', async (req, res) => {
  try {
    const { url, maxDepth = 2 } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = await scraperService.crawlWebsite(url, maxDepth);
    res.json({ success: true, data, count: data.length });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to crawl website',
      message: error.message 
    });
  }
});

/**
 * POST /api/scraper/search
 * Search the web
 */
router.post('/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const data = await scraperService.search(query, limit);
    res.json({ success: true, data, count: data.length });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
});

/**
 * GET /api/scraper/walchand
 * Scrape Walchand College website
 */
router.get('/walchand', async (req, res) => {
  try {
    const data = await scraperService.scrapeWalchandCollege();
    res.json({ success: true, data, count: data.length });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to scrape Walchand College website',
      message: error.message 
    });
  }
});

/**
 * GET /api/scraper/documents
 * Get all downloadable documents from WCE website
 */
router.get('/documents', async (req, res) => {
  try {
    const documents = await scraperService.getAllDownloadableDocuments();
    res.json({ success: true, data: documents, count: documents.length });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      message: error.message 
    });
  }
});

export default router;
