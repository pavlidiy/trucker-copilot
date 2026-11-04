// Writes a detention claim and reads a broker answer with Muse Spark, to check prompts by eye.
// npm run try-letter -- [lang]   (needs MUSE_API_KEY in .env)
import { LANGUAGE_NAMES, readBrokerAnswer, writeLetter, type LetterFacts } from './ai/email.ts';

const lang = process.argv[2] ?? 'ru';
const language = LANGUAGE_NAMES[lang] ?? 'English';
const cfg = { apiKey: process.env.MUSE_API_KEY ?? '', model: process.env.MUSE_MODEL ?? 'muse-spark-1.3' };

const facts: LetterFacts = {
  kind: 'detention_claim',
  driverName: 'Ivan Petrov',
  company: 'Petrov Trucking LLC, MC 1234567',
  loadNumber: 'SFB-448812',
  broker: 'Sunbelt Freight Brokerage LLC',
  stops: [
    {
      kind: 'pickup',
      place: 'Walmart DC 7035, Atlanta, GA',
      arrived: '11/02 08:12 EST',
      left: '11/02 13:47 EST',
      timeZone: 'America/New_York',
      waitedMinutes: 335,
      billableMinutes: 215,
      amountUsd: 179.17,
    },
  ],
  freeHours: 2,
  ratePerHourUsd: 50,
  totalUsd: 179.17,
  rateconQuotes: [],
  asks: [],
  offeredUsd: null,
};

let started = Date.now();
const letter = await writeLetter(cfg, facts, language);
console.log(`--- letter (${Date.now() - started} ms) ---\nSubject: ${letter.subject}\n\n${letter.body}\n\n🗣 ${letter.translation}\n`);

started = Date.now();
const answer = await readBrokerAnswer(
  cfg,
  { text: 'Hi Ivan, we checked with the shipper. We can pay $100 detention, please send the signed BOL with in/out times.' },
  { driverLanguage: language, claimedUsd: 179.17 },
);
console.log(`--- broker answer (${Date.now() - started} ms) ---\n${JSON.stringify(answer, null, 2)}`);
