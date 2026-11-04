// Free-form questions through the real Muse Spark, to check the assistant by eye.
// npm run try-chat -- [lang] ["one message"]   (needs MUSE_API_KEY in .env)
import { converse, type Turn } from './ai/assistant.ts';
import { LANGUAGE_NAMES } from './ai/email.ts';
import { understand } from './ai/intent.ts';

const lang = process.argv[2] ?? 'ru';
const language = LANGUAGE_NAMES[lang] ?? 'English';
const cfg = { apiKey: process.env.MUSE_API_KEY ?? '', model: process.env.MUSE_MODEL ?? 'muse-spark-1.3' };

const messages = process.argv[3]
  ? [process.argv[3]]
  : [
      'привет, что ты умеешь?',
      'взял груз у Echo, 2100 за 850 миль, Даллас - Атланта',
      'детеншн 40 в час после 2 часов, погрузка завтра в 8 утра',
      'что делать если брокер не хочет платить детеншн?',
      'как сказать ресиверу что паллета повреждена?',
      'посоветуй хороший фильм',
    ];

const history: Turn[] = [];
for (const text of messages) {
  const intent = await understand(cfg, text, undefined);
  console.log(`\n> ${text}\n  intent: ${intent}`);
  if (intent !== 'other' && intent !== 'help') continue;
  const t0 = Date.now();
  const a = await converse(cfg, text, { language, driverName: 'Ivan', loadContext: null, history });
  console.log(`  (${Date.now() - t0} ms) on_topic=${a.on_topic} suggest=${a.suggest} load=${JSON.stringify(a.load)}`);
  console.log(a.reply.replace(/^/gm, '  | '));
  history.push({ role: 'driver', text }, { role: 'bot', text: a.reply });
}
