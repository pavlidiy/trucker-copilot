// Transcribes an audio file with Muse Voice Transcribe and routes the text with Muse Spark.
// npm run try-voice -- note.ogg   (needs MUSE_API_KEY in .env and ffmpeg)
import { readFileSync } from 'node:fs';
import { understand } from './ai/intent.ts';
import { transcribe } from './ai/voice.ts';

const [file] = process.argv.slice(2);
if (!file) throw new Error('usage: npm run try-voice -- <audio file>');
const apiKey = process.env.MUSE_API_KEY ?? '';
const speed = Number(process.env.VOICE_SPEED ?? 1);

let started = Date.now();
const text = await transcribe({ apiKey, speed }, readFileSync(file));
console.log(`heard (${Date.now() - started} ms, speed ×${speed}): ${text}`);
started = Date.now();
const intent = await understand({ apiKey, model: process.env.MUSE_MODEL ?? 'muse-spark-1.3' }, text, 'at_pickup');
console.log(`intent (${Date.now() - started} ms): ${intent}`);
