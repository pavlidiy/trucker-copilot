// Reads one rate con with Muse Spark and prints what the bot would answer.
// npm run try-ratecon -- [file.pdf|photo.jpg] [lang]   (needs MUSE_API_KEY in .env)
import { readFileSync } from 'node:fs';
import { readRatecon } from './ai/ratecon.ts';
import { toAnalysis } from './domain/risks.ts';
import { isLang } from './i18n/index.ts';
import { rateconResult } from './ui/screens.ts';
import { render } from './wa/render.ts';

const [file = 'test/fixtures/ratecon-sample.pdf', lang = 'ru'] = process.argv.slice(2);
const mime = file.endsWith('.pdf') ? 'application/pdf' : file.endsWith('.png') ? 'image/png' : 'image/jpeg';
const started = Date.now();
const extract = await readRatecon(
  { apiKey: process.env.MUSE_API_KEY ?? '', model: process.env.MUSE_MODEL ?? 'muse-spark-1.3' },
  [{ mime, data: readFileSync(file), filename: file.split('/').pop() }],
);
console.log(JSON.stringify(extract, null, 2));
console.log(`\n--- Muse Spark: ${Date.now() - started} ms ---\n`);
const ctx = { lang: isLang(lang) ? lang : 'en', timeZone: 'America/Chicago' } as const;
console.log(rateconResult(ctx, toAnalysis(extract)).map(render).join('\n---\n'));
