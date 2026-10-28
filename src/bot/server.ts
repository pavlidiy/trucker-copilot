import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig, type Config } from './config.ts';
import { Db } from './db.ts';
import { route } from './router.ts';
import { extractMessages, markReadAndTyping, sendMessage, verifySignature, type WebhookBody } from './whatsapp.ts';

// WhatsApp webhook server. Meta calls GET once to verify the URL, then POSTs every message.
// We answer 200 right away and do the work after, because Meta retries slow webhooks.

export function startServer(cfg: Config = loadConfig()) {
  const db = new Db(cfg);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (url.pathname === '/health') return reply(res, 200, 'ok');
      if (url.pathname !== '/webhook') return reply(res, 404, 'not found');

      if (req.method === 'GET') {
        const ok = url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === cfg.verifyToken;
        return ok ? reply(res, 200, url.searchParams.get('hub.challenge') ?? '') : reply(res, 403, 'forbidden');
      }
      if (req.method !== 'POST') return reply(res, 405, 'method not allowed');

      const raw = await readBody(req);
      if (!verifySignature(raw, header(req, 'x-hub-signature-256'), cfg.appSecret)) return reply(res, 401, 'bad signature');
      reply(res, 200, 'ok');

      const body = JSON.parse(raw.toString('utf8')) as WebhookBody;
      for (const msg of extractMessages(body, cfg.phoneNumberId)) {
        void handle(msg).catch((err) => console.error(`message ${msg.id} failed:`, err));
      }
    } catch (err) {
      console.error(err);
      if (!res.headersSent) reply(res, 500, 'error');
    }
  });

  async function handle(msg: Parameters<typeof route>[1]): Promise<void> {
    if (!(await db.claimMessage(msg.id))) return; // Meta retry of something we already handled
    await markReadAndTyping(cfg, msg.id);
    const replies = await route(db, msg);
    // In order: WhatsApp shows them as separate bubbles and order matters (e.g. "copy" mode).
    for (const out of replies) await sendMessage(cfg, msg.from, out);
  }

  server.listen(cfg.port, () => console.log(`trucker-copilot listening on :${cfg.port} (POST /webhook)`));
  return server;
}

function reply(res: ServerResponse, status: number, body: string): void {
  res.writeHead(status, { 'Content-Type': 'text/plain' }).end(body);
}

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

async function readBody(req: IncomingMessage, limit = 1_000_000): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw new Error('webhook body too large');
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}
