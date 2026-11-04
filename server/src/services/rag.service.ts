import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

type Doc = { id: string; title: string; category: string; date?: string; url?: string; content: string };
const defaultGoogleModel = 'gemini-3-flash-preview,gemini-3.1-flash-lite';
const transientProviderStatuses = new Set([429, 500, 502, 503, 504]);
const terms = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter(x => x.length > 2 && !'the and for are was with from about what when where who how does this that'.split(' ').includes(x)) ?? [];
const dataPath = path.resolve(process.cwd(), '../public/scraped');
const notesPath = path.resolve(process.cwd(), '../public/downloads');
function flatten(v: unknown): string { if (v == null) return ''; if (typeof v !== 'object') return String(v); if (Array.isArray(v)) return v.map(flatten).join('\n'); return Object.entries(v as Record<string, unknown>).filter(([k]) => !['id','url','sourceUrl','attachments'].includes(k)).map(([k,x]) => `${k}: ${flatten(x)}`).join('\n'); }
async function corpus(): Promise<Doc[]> {
  const docs: Doc[] = [];
  try { for (const file of await readdir(dataPath)) if (file.endsWith('.json')) { try { const parsed = JSON.parse(await readFile(path.join(dataPath,file),'utf8')); for (const [i,row] of (Array.isArray(parsed)?parsed:[parsed]).entries()) { const x = row as Record<string,unknown>; docs.push({ id:String(x.id||`${file}-${i}`), title:String(x.title||x.name||x.subject||file), category:String(x.category||path.basename(file,'.json')), date:x.date||x.publishedAt?String(x.date||x.publishedAt):undefined, url:typeof x.url==='string'?x.url:undefined, content:flatten(x) }); } } catch { /* Ignore malformed scraped files. */ } } } catch { /* Scrape data can be absent. */ }
  try { for (const file of await readdir(notesPath)) if (/\.(txt|md)$/i.test(file)) { const body=await readFile(path.join(notesPath,file),'utf8'); const chunks=body.split(/\n\s*\n/).filter(x=>x.trim().length>60); for(let i=0;i<chunks.length;i+=3) docs.push({id:`${file}-${i}`,title:path.basename(file),category:'Study notes',content:chunks.slice(i,i+3).join('\n')}); } } catch { /* Notes are optional. */ }
  return docs;
}
function retrieve(query:string, docs:Doc[]) { const q=[...new Set(terms(query))]; const now=Date.now(); return docs.map(doc=>{ const text=`${doc.title} ${doc.category} ${doc.content}`.toLowerCase(); let score=0; for(const word of q){const count=(text.match(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\$&')}\\b`,'g'))||[]).length; if(count) score+=(1+Math.log(count))*Math.log(1+docs.length/(1+docs.filter(d=>`${d.title} ${d.content}`.toLowerCase().includes(word)).length)); if(doc.title.toLowerCase().includes(word)) score+=1.4;} const date=doc.date?Date.parse(doc.date):NaN; if(Number.isFinite(date)&&date<=now) score*=1+.12*Math.exp(-(now-date)/(365*86400000)); return {...doc,score}; }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5); }
function excerpt(content:string,q:string){const qterms=terms(q); return content.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).map((sentence,index)=>({sentence,index,score:qterms.filter(t=>sentence.toLowerCase().includes(t)).length})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,3).sort((a,b)=>a.index-b.index).map(x=>x.sentence).join(' ').slice(0,450);}
async function generateAnswer(query:string,hits:ReturnType<typeof retrieve>):Promise<string|null>{
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey === 'your_google_ai_api_key_here') return null;
  const models = (process.env.GOOGLE_AI_MODEL || defaultGoogleModel)
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);

  const context = hits.map((h,i)=>`[${i+1}] ${h.title} (${h.category}; date ${h.date||'not supplied'})\n${h.content.slice(0,4000)}`).join('\n\n');

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,{
          method:'POST',
          headers:{'content-type':'application/json'},
          signal:AbortSignal.timeout(30000),
          body:JSON.stringify({
            contents:[{
              parts:[{
                text:`You are a helpful college study assistant for Walchand College of Engineering. Answer the user's question using ONLY the provided context below. Write clear organized notes using useful headings, bullets, steps or tables. Cite claims as [1], [2]. State what is missing. Never invent facts or dates.

Question: ${query}

Context:
${context}`
              }]
            }]
          })
        });
        if (r.ok) {
          const data = await r.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
          return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        }

        const details = (await r.text()).slice(0, 500);
        console.error(`Google AI API error (${model}, attempt ${attempt + 1}):`, r.status, details);
        if (!transientProviderStatuses.has(r.status)) break;
        if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 750));
      } catch (error) {
        console.error(`Google AI request failed (${model}, attempt ${attempt + 1}):`, error);
        if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 750));
      }
    }
  }
  return null;
}
export async function answerFromKnowledgeBase(query:string){
  const hits=retrieve(query,await corpus());
  if(!hits.length)return{
    content:'I could not find a relevant answer in the local scraped data or study notes. Try a specific course, department, notice, or topic.',
    sources:[],
    model:'local-retrieval',
    grounded:true
  };
  const answer=await generateAnswer(query,hits);
  const content=answer||`## Relevant information\n\n${hits.slice(0,3).map((h,i)=>`### ${i+1}. ${h.title}\n${excerpt(h.content,query)}`).join('\n\n')}\n\n*Showing retrieved local notes. Configure Google AI API key for synthesized answers.*`;
  const max=hits[0].score;
  return{
    content,
    sources:hits.map(h=>({
      id:h.id,
      title:h.title,
      page:1,
      excerpt:excerpt(h.content,query),
      category:h.category,
      date:h.date||null,
      relevance:Math.round(h.score/max*100),
      url:h.url||null
    })),
    model:answer?(process.env.GOOGLE_AI_MODEL || defaultGoogleModel).split(',')[0].trim():'local-retrieval',
    grounded:true
  };
}
