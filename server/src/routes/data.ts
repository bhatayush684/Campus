import express from 'express';
import { dataService } from '../services/data.service.js';
import { scraperService } from '../services/scraper.service.js';

const router = express.Router();

/**
 * GET /api/data/notices
 * Get all notices
 */
router.get('/notices', async (req, res) => {
  try {
    // In production, this would fetch from database
    // For now, scrape and process
    const scrapedData = await scraperService.scrapeWalchandCollege();
    const processed = dataService.processData(scrapedData);
    res.json({ success: true, data: processed.notices });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch notices',
      message: error.message 
    });
  }
});

/**
 * GET /api/data/timetables
 * Get all timetables
 */
router.get('/timetables', async (req, res) => {
  try {
    const scrapedData = await scraperService.scrapeWalchandCollege();
    const processed = dataService.processData(scrapedData);
    res.json({ success: true, data: processed.timetables });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch timetables',
      message: error.message 
    });
  }
});

/**
 * GET /api/data/faculty
 * Get all faculty information
 */
router.get('/faculty', async (req, res) => {
  try {
    const scrapedData = await scraperService.scrapeWalchandCollege();
    const processed = dataService.processData(scrapedData);
    res.json({ success: true, data: processed.faculty });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch faculty data',
      message: error.message 
    });
  }
});

/**
 * GET /api/data/departments
 * Get all departments
 */
router.get('/departments', async (req, res) => {
  try {
    const scrapedData = await scraperService.scrapeWalchandCollege();
    const processed = dataService.processData(scrapedData);
    res.json({ success: true, data: processed.departments });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch departments',
      message: error.message 
    });
  }
});

export default router;
