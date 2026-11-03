// Voice notes → text with Muse Voice Transcribe (Meta Model API, realtime WebSocket).
// WhatsApp voice notes are OGG/Opus; the API takes raw PCM16 mono 24 kHz, so ffmpeg decodes first.
// https://dev.meta.ai/docs/api-reference/voice/realtime

import { spawn } from 'node:child_process';

export interface VoiceConfig {
  apiKey: string;
  model?: string; // "muse-voice-transcribe-1.0"
  url?: string;
  /** How much faster than real time to stream. The API rejects audio that backs up, so stay close to 1. */
  speed?: number;
}

const SAMPLE_RATE = 24_000;
const CHUNK_MS = 80;
const CHUNK_BYTES = (SAMPLE_RATE * 2 * CHUNK_MS) / 1000; // 3840

export async function transcribe(cfg: VoiceConfig, audio: Uint8Array): Promise<string> {
  return transcribePcm(cfg, await toPcm24k(audio));
}

/** Any audio ffmpeg can read → PCM16 little-endian, mono, 24 kHz. */
export function toPcm24k(audio: Uint8Array): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE), 'pipe:1']);
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    ff.stdout.on('data', (c: Buffer) => out.push(c));
    ff.stderr.on('data', (c: Buffer) => err.push(c));
    ff.on('error', reject);
    ff.on('close', (code) =>
      code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`ffmpeg ${code}: ${Buffer.concat(err).toString()}`)),
    );
    ff.stdin.end(Buffer.from(audio));
  });
}

export function transcribePcm(cfg: VoiceConfig, pcm: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(cfg.url ?? 'wss://api.meta.ai/v1/asr/realtime');
    ws.binaryType = 'arraybuffer';
    const finals: string[] = [];
    let partial = '';
    let started = false;
    const fail = (err: Error) => {
      try { ws.close(); } catch { /* already closed */ }
      reject(err);
    };
    const timeout = setTimeout(() => fail(new Error('voice transcription timed out')), 60_000 + (pcm.length / (SAMPLE_RATE * 2)) * 1000);

    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          authorization: { accessToken: `Bearer ${cfg.apiKey}` },
          audioEncoding: 'PCM_24KHZ',
          model: cfg.model ?? 'muse-voice-transcribe-1.0',
          mode: 'PUSH_TO_TALK',
        }),
      );
    });

    ws.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') return; // the server may send binary frames; we don't need them
      const msg = JSON.parse(event.data) as { type?: string; message?: string; transcript?: string; final?: boolean; sessionId?: string };
      if (!msg.type) {
        // Handshake acknowledgement: the only frame without a type.
        if (!msg.sessionId) return fail(new Error(`voice handshake rejected: ${event.data}`));
        if (!started) {
          started = true;
          void stream(ws, pcm, cfg.speed ?? 1).catch(fail);
        }
        return;
      }
      if (msg.type === 'error') return fail(new Error(`voice: ${msg.message}`));
      if (msg.type === 'transcript' && msg.transcript !== undefined) {
        if (msg.final) {
          finals.push(msg.transcript);
          partial = '';
        } else {
          partial = msg.transcript;
        }
      }
    });

    ws.addEventListener('close', (event) => {
      clearTimeout(timeout);
      if (event.code !== 1000) return reject(new Error(`voice socket closed ${event.code}: ${event.reason}`));
      resolve([...finals, partial].join(' ').replace(/\s+/g, ' ').trim().replace(/([.!?…])[.!?…]+$/u, '$1'));
    });
    ws.addEventListener('error', () => fail(new Error('voice socket error')));
  });
}

/** 80 ms binary frames, paced like a live microphone, then endStream (keep reading until the server closes). */
async function stream(ws: WebSocket, pcm: Buffer, speed: number): Promise<void> {
  const delay = CHUNK_MS / speed;
  const t0 = Date.now();
  for (let i = 0, n = 0; i < pcm.length; i += CHUNK_BYTES, n++) {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.send(new Uint8Array(pcm.subarray(i, i + CHUNK_BYTES))); // copy: WebSocket wants a plain ArrayBuffer view
    const wait = t0 + (n + 1) * delay - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }
  ws.send(JSON.stringify({ type: 'endStream' }));
}
