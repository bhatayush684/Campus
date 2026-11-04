import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });
const BASE = 'https://www.walchandsangli.ac.in';

async function get(url) {
  try {
    const r = await axios.get(url, { httpsAgent: agent, headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 });
    return cheerio.load(r.data);
  } catch (e) {
    console.warn('FAIL:', url, e.message);
    return null;
  }
}

const $ = await get(BASE);
if ($) {
  const links = [];
  $('a[href]').each((i, el) => {
    const h = $(el).attr('href');
    if (h && h.length > 1 && !h.startsWith('#') && !h.startsWith('mailto') && !h.startsWith('tel')) {
      const full = h.startsWith('http') ? h : BASE + (h.startsWith('/') ? h : '/' + h);
      links.push({ text: $(el).text().trim().replace(/\s+/g, ' ').substring(0, 80), url: full });
    }
  });
  const uniq = links.filter((l, i, a) => a.findIndex(x => x.url === l.url) === i).slice(0, 60);
  console.log(JSON.stringify(uniq, null, 2));
}
