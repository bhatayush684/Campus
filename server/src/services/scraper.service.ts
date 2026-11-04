import { URL } from 'node:url';
import https from 'node:https';

export interface ScrapedData {
  url: string;
  title: string;
  content: string;
  markdown: string;
  links: string[];
  images: string[];
  pdfs: string[];
  documents: DownloadableDocument[];
  timestamp: Date;
}

export interface DownloadableDocument {
  url: string;
  title: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'zip' | 'other';
  category: 'notes' | 'syllabus' | 'question-paper' | 'notice' | 'other';
}

const allowedHosts = new Set(['walchandsangli.ac.in', 'www.walchandsangli.ac.in', 'walchandsangli.com', 'www.walchandsangli.com']);
const ignoredExtensions = /\.(?:jpg|jpeg|png|gif|svg|webp|css|js|ico|woff2?)(?:\?|$)/i;
const documentPattern = /\.(pdf|docx?|xlsx?|pptx?|zip)(?:\?|$)/i;
const requestHeaders = { 'user-agent': 'CampusMind/1.0 (+https://github.com/bhatayush684/Campus)' };

function requestHtml(url: URL): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: requestHeaders, rejectUnauthorized: false }, response => {
      if (response.statusCode && response.statusCode >= 400) {
        response.resume();
        reject(new Error(`Website returned HTTP ${response.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      response.on('data', chunk => chunks.push(Buffer.from(chunk)));
      response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    request.setTimeout(20000, () => request.destroy(new Error('Website request timed out')));
    request.on('error', reject);
  });
}

function absoluteUrl(value: string, base: string): string | null {
  try {
    const url = new URL(value, base);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function cleanText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyDocument(url: string): DownloadableDocument['category'] {
  const value = url.toLowerCase();
  if (value.includes('syllabus') || value.includes('curriculum')) return 'syllabus';
  if (value.includes('question') || value.includes('paper')) return 'question-paper';
  if (value.includes('notice') || value.includes('circular') || value.includes('exam')) return 'notice';
  if (value.includes('note') || value.includes('study')) return 'notes';
  return 'other';
}

function documentType(url: string): DownloadableDocument['type'] {
  const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  const type = match?.[1].toLowerCase();
  return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'].includes(type || '')
    ? type as DownloadableDocument['type']
    : 'other';
}

function extractLinks(html: string, pageUrl: string) {
  const links = new Set<string>();
  const images = new Set<string>();
  const documents: DownloadableDocument[] = [];
  for (const match of html.matchAll(/<(a|img)\b[^>]+(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const url = absoluteUrl(match[2], pageUrl);
    if (!url || ignoredExtensions.test(url)) continue;
    if (match[1].toLowerCase() === 'img') images.add(url);
    else links.add(url);
  }
  for (const url of links) {
    if (documentPattern.test(url)) {
      documents.push({
        url,
        title: decodeURIComponent(new URL(url).pathname.split('/').pop() || 'Download'),
        type: documentType(url),
        category: classifyDocument(url)
      });
    }
  }
  return { links: [...links], images: [...images], documents };
}

export class ScraperService {
  async scrapePage(url: string): Promise<ScrapedData> {
    const parsedUrl = new URL(url);
    if (!allowedHosts.has(parsedUrl.hostname.toLowerCase())) {
      throw new Error('Only walchandsangli.ac.in and walchandsangli.com are allowed');
    }
    const html = await requestHtml(parsedUrl);
    const title = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || parsedUrl.hostname);
    const content = cleanText(html);
    const extracted = extractLinks(html, parsedUrl.toString());
    const markdown = `# ${title}\n\nSource: ${parsedUrl}\n\n${content}`;
    return { url: parsedUrl.toString(), title, content, markdown, ...extracted, pdfs: extracted.documents.filter(document => document.type === 'pdf').map(document => document.url), timestamp: new Date() };
  }

  async crawlWebsite(startUrl: string, maxDepth = 1): Promise<ScrapedData[]> {
    const queue: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
    const visited = new Set<string>();
    const results: ScrapedData[] = [];
    while (queue.length && results.length < 50) {
      const current = queue.shift();
      if (!current || visited.has(current.url)) continue;
      visited.add(current.url);
      try {
        const page = await this.scrapePage(current.url);
        results.push(page);
        if (current.depth < maxDepth) {
          for (const link of page.links) {
            const parsed = new URL(link);
            if (allowedHosts.has(parsed.hostname.toLowerCase()) && !visited.has(link)) {
              queue.push({ url: link, depth: current.depth + 1 });
            }
          }
        }
      } catch (error) {
        console.error(`Scrape failed for ${current.url}:`, error);
      }
    }
    return results;
  }

  async search(query: string, limit = 10): Promise<ScrapedData[]> {
    const pages = await this.crawlWebsite('https://walchandsangli.ac.in', 1);
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    return pages
      .map(page => ({ page, score: terms.filter(term => page.content.toLowerCase().includes(term)).length }))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.min(limit, 20)))
      .map(result => result.page);
  }

  async scrapeWalchandCollege(): Promise<ScrapedData[]> {
    const roots = (process.env.WCE_BASE_URLS || 'https://walchandsangli.ac.in,https://walchandsangli.com')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const pages: ScrapedData[] = [];
    for (const root of roots) pages.push(...await this.crawlWebsite(root, Number(process.env.SCRAPE_MAX_DEPTH || 1)));
    return pages;
  }

  async getAllDownloadableDocuments(): Promise<DownloadableDocument[]> {
    const pages = await this.scrapeWalchandCollege();
    return [...new Map(pages.flatMap(page => page.documents).map(document => [document.url, document])).values()];
  }
}

export const scraperService = new ScraperService();
