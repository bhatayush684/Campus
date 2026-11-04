const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost';

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${path} returned ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const health = await request('/health');
if (health.status !== 'ok') throw new Error('Health check did not report ok');

const status = await request('/api/chat/status');
if (!status.provider) throw new Error('Chat status did not include a provider');

const chat = await request('/api/chat/message', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ message: 'What is data structures and algorithms?' }),
});
if (!chat.success || !chat.data?.content || !Array.isArray(chat.data.sources)) {
  throw new Error('Chat response is missing grounded content or sources');
}

console.log(`Smoke test passed: ${baseUrl} (${chat.data.model})`);
