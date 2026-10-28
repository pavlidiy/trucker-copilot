// Walks through the demo scenario and prints every bot message the way the driver sees it.
//   npm run preview -- --lang ru
//   npm run preview -- --lang en --json   (raw Cloud API payloads)

import { parseArgs } from 'node:util';
import { DEFAULT_TERMS } from './domain/detention.ts';
import type { LoadSummary, RateconAnalysis } from './domain/types.ts';
import { isLang, LANGS, t } from './i18n/index.ts';
import * as screen from './ui/screens.ts';
import { render } from './wa/render.ts';
import type { OutgoingMessage } from './wa/types.ts';

const { values } = parseArgs({
  options: {
    lang: { type: 'string', default: 'ru' },
    json: { type: 'boolean', default: false },
  },
});

if (!isLang(values.lang)) {
  console.error(`Unknown language "${values.lang}". Available: ${LANGS.join(', ')}`);
  process.exit(1);
}

const ctx: screen.Ctx = { lang: values.lang, timeZone: 'America/New_York' };
const at = (hhmm: string) => new Date(`2026-11-02T${hhmm}:00-05:00`);

const analysis: RateconAnalysis = {
  loadNumber: '48213',
  broker: 'ABC Logistics',
  brokerEmail: 'dispatch@abclogistics.com',
  pickup: { name: 'Walmart DC 6094', city: 'Dallas, TX' },
  delivery: { name: 'Walmart DC 7035', city: 'Atlanta, GA' },
  rateCents: 215_000,
  miles: 781,
  risks: [
    { level: 'red', code: 'no_detention_clause' },
    { level: 'red', code: 'late_fine', amountCents: 25_000, ref: 'p. 2, §7' },
    { level: 'yellow', code: 'lumper_on_driver' },
    { level: 'green', code: 'good_rate' },
  ],
  pickupReputation: {
    rating: 2.1,
    reviewQuote: 'waited 5-6 hours',
    avgWaitMinutes: 220,
    mapsUrl: 'https://maps.google.com/?cid=0',
    slow: true,
  },
};

const loads: LoadSummary[] = [
  { loadNumber: '48213', pickup: analysis.pickup, delivery: analysis.delivery, stage: 'left_delivery', detentionCents: 17_917 },
  { loadNumber: '47990', pickup: { name: '', city: 'Houston, TX' }, delivery: { name: '', city: 'Memphis, TN' }, stage: 'closed', detentionCents: 10_000 },
];

const draft: screen.EmailDraft = {
  to: analysis.brokerEmail!,
  subject: 'Detention — Load #48213, Walmart DC Atlanta — $179.17',
  body:
    'Hello,\n\nI arrived at Walmart DC 7035 at 08:12 and was released at 13:47 (BOL signed 13:41). ' +
    'That is 5 h 35 min on site, 3 h 35 min past the 2 free hours. At $50/hr the detention is $179.17.\n\n' +
    'Please confirm it will be added to the settlement.\n\nThank you,\nIvan Petrov, MC 1234567',
};

type Step = [label: string, driver: string | null, messages: OutgoingMessage[]];

const steps: Step[] = [
  ['1. First contact', 'Hi', screen.welcome()],
  ['2. Onboarding', t(ctx.lang).langName, screen.askName(ctx)],
  ['', 'Ivan Petrov', screen.askCompany(ctx)],
  ['', 'MC 1234567', screen.askEmail(ctx)],
  ['', 'ivan@example.com', screen.disclaimer(ctx)],
  ['', '👍', screen.onboardingDone(ctx, 'Ivan')],
  ['3. Main menu', '☰', screen.mainMenu(ctx)],
  ['4. Rate con check', '📄 ratecon.pdf', [...screen.rateconReading(ctx), ...screen.rateconResult(ctx, analysis)]],
  ['', '✅', screen.loadSaved(ctx, analysis.loadNumber)],
  ['5. Delivery stop', '📍', screen.askArriveLocation(ctx, 'delivery')],
  ['', '📍 (location)', screen.arrived(ctx, at('08:12'), analysis.delivery.name, DEFAULT_TERMS)],
  ['', null, screen.freeTimeOver(ctx, at('10:12'))],
  ['', '⏱', screen.detentionRunning(ctx, at('08:12'), at('11:42'), DEFAULT_TERMS)],
  ['', '🚚 (location)', screen.left(ctx, at('08:12'), at('13:47'), DEFAULT_TERMS)],
  ['6. BOL', '🧾 bol.jpg', screen.bolChecked(ctx, at('13:41'), at('13:47'))],
  ['7. Broker email', '✉️', screen.emailDraft(ctx, draft)],
  ['', '📋', screen.emailCopy(ctx, draft)],
  ['', '📤', screen.emailSent(ctx, draft.to, 'ivan@example.com')],
  [
    '8. Broker replies',
    null,
    screen.brokerReply(ctx, {
      summary: ctx.lang === 'ru' ? 'Пришлите подписанный BOL с временем, и мы одобрим $150' : 'Send the signed BOL with times and we will approve $150',
      meaning: ctx.lang === 'ru' ? 'согласны, но режут сумму на $29.17.' : 'they agree but cut $29.17.',
      offeredCents: 15_000,
    }),
  ],
  ['9. My loads', '📦', screen.myLoads(ctx, loads)],
  ['', '#48213', screen.loadCard(ctx, loads[0]!)],
  ['10. Money recovered', '💰', screen.recovered(ctx, 'October', 32_917, 3)],
  ['11. Settings', '⚙️', screen.settings(ctx)],
  ['', '🗑', screen.confirmDelete(ctx)],
  ['12. Errors', '🎤 (noise)', screen.voiceNotUnderstood(ctx)],
  ['', '📷 blurry.jpg', screen.rateconUnreadable(ctx, 2)],
];

const indent = (str: string, pad: string) => str.split('\n').map((l) => pad + l).join('\n');

for (const [label, driver, messages] of steps) {
  if (label) console.log(`\n━━━ ${label} ━━━`);
  if (driver) console.log(`\n${' '.repeat(40)}🧑‍✈️ ${driver}`);
  for (const m of messages) {
    console.log('');
    console.log(values.json ? JSON.stringify(m, null, 2) : indent(render(m), '🤖 │ '));
  }
}
