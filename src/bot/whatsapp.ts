import { createHmac, timingSafeEqual } from 'node:crypto';
import type { DocumentPart } from '../ai/ratecon.ts';
import type { OutgoingMessage } from '../wa/types.ts';
import type { Config } from './config.ts';

// Incoming webhook payload, only the fields we read.
// https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples

export interface InboundMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'location' | 'image' | 'document' | 'audio' | 'button' | string;
  text?: { body: string };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  image?: { id: string; mime_type: string; caption?: string };
  document?: { id: string; mime_type: string; filename?: string; caption?: string };
  audio?: { id: string; mime_type: string; voice?: boolean };
}

export interface WebhookBody {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      field?: string;
      value?: {
        metadata?: { phone_number_id?: string };
        contacts?: Array<{ wa_id: string; profile?: { name?: string } }>;
        messages?: InboundMessage[];
      };
    }>;
  }>;
}

/** Messages addressed to our number. Status updates (sent/delivered/read) are skipped. */
export function extractMessages(body: WebhookBody, phoneNumberId: string): InboundMessage[] {
  const out: InboundMessage[] = [];
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (change.field !== 'messages' || value?.metadata?.phone_number_id !== phoneNumberId) continue;
      out.push(...(value.messages ?? []));
    }
  }
  return out;
}

/** Meta signs the raw body with the app secret: "sha256=<hex>". */
export function verifySignature(rawBody: Buffer, header: string | undefined, appSecret: string): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  const given = Buffer.from(header.slice('sha256='.length), 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function sendMessage(cfg: Config, to: string, msg: OutgoingMessage): Promise<void> {
  const res = await fetch(`https://graph.facebook.com/${cfg.graphVersion}/${cfg.phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.waToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to, ...msg }),
  });
  if (!res.ok) throw new Error(`WhatsApp send failed ${res.status}: ${await res.text()}`);
}

/** Blue ticks plus the "typing…" bubble while we work on a reply. */
export async function markReadAndTyping(cfg: Config, messageId: string): Promise<void> {
  await fetch(`https://graph.facebook.com/${cfg.graphVersion}/${cfg.phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.waToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
      typing_indicator: { type: 'text' },
    }),
  }).catch(() => undefined); // cosmetic; never fail a reply over it
}

/** Photos and PDFs arrive as a media id: look up its short-lived URL, then fetch it with the same token. */
export async function downloadMedia(cfg: Config, mediaId: string, filename?: string): Promise<DocumentPart> {
  const auth = { Authorization: `Bearer ${cfg.waToken}` };
  const meta = await fetch(`https://graph.facebook.com/${cfg.graphVersion}/${mediaId}`, { headers: auth });
  if (!meta.ok) throw new Error(`WhatsApp media lookup failed ${meta.status}: ${await meta.text()}`);
  const { url, mime_type } = (await meta.json()) as { url: string; mime_type: string };
  const file = await fetch(url, { headers: auth });
  if (!file.ok) throw new Error(`WhatsApp media download failed ${file.status}`);
  return { mime: mime_type.split(';')[0]!.trim(), data: new Uint8Array(await file.arrayBuffer()), filename };
}
