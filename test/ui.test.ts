import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { LoadStage } from '../src/domain/types.ts';
import { formatMoney, LANGS, STRINGS, t, type Lang } from '../src/i18n/index.ts';
import { ID } from '../src/ui/ids.ts';
import * as screen from '../src/ui/screens.ts';
import { nextActions, withMenu } from '../src/ui/stage.ts';
import { buttons, fit, LIMITS, list, paginate } from '../src/wa/builders.ts';
import type { OutgoingMessage } from '../src/wa/types.ts';

const STAGES: LoadStage[] = ['checked', 'booked', 'at_pickup', 'left_pickup', 'at_delivery', 'left_delivery', 'claim_sent', 'closed'];

test('fit keeps short text and cuts long text with an ellipsis', () => {
  assert.equal(fit('Menu', 20), 'Menu');
  const cut = fit('✅ Согласиться на $179.17', 20);
  assert.equal([...cut].length, 20);
  assert.ok(cut.endsWith('…'));
});

test('builders refuse more than WhatsApp allows', () => {
  const four = [1, 2, 3, 4].map((n) => ({ id: `b${n}`, title: `${n}` }));
  assert.throws(() => buttons('x', four));
  const eleven = Array.from({ length: 11 }, (_, n) => ({ id: `r${n}`, title: `${n}` }));
  assert.throws(() => list('x', 'y', [{ rows: eleven }]));
  assert.throws(() => buttons('x', [{ id: 'a', title: '1' }, { id: 'a', title: '2' }]));
});

test('paginate fits 11 languages into two list pages', () => {
  const rows = Array.from({ length: 11 }, (_, n) => ({ id: `lang:${n}`, title: `L${n}` }));
  const more = (p: number) => ({ id: `lang_page:${p}`, title: 'More' });
  const first = paginate(rows, 0, more);
  const second = paginate(rows, 1, more);
  assert.equal(first.length, LIMITS.listRows);
  assert.equal(first.at(-1)?.id, 'lang_page:1');
  assert.deepEqual(second.map((r) => r.id), ['lang:9', 'lang:10']);
});

test('every stage ends with Menu and has at most three buttons', () => {
  for (const lang of LANGS) {
    for (const stage of STAGES) {
      const choices = withMenu(nextActions(stage, t(lang)), t(lang));
      assert.ok(choices.length <= 3, `${lang}/${stage}`);
      assert.equal(choices.at(-1)?.id, ID.menu);
    }
  }
});

// Truncation is a safety net, not the design: every label in every language must fit as written.
test('button and row labels fit without truncation in every language', () => {
  const tooLong: string[] = [];
  const check = (lang: Lang, msgs: OutgoingMessage[]) => {
    for (const m of msgs) {
      if (m.type !== 'interactive') continue;
      const i = m.interactive;
      if (i.type === 'button') for (const b of i.action.buttons) if (b.reply.title.endsWith('…')) tooLong.push(`${lang}: ${b.reply.title}`);
      if (i.type === 'list') for (const sec of i.action.sections) for (const r of sec.rows) if (r.title.endsWith('…')) tooLong.push(`${lang}: ${r.title}`);
    }
  };
  for (const lang of LANGS) {
    const ctx = { lang, timeZone: 'America/Chicago' };
    const now = new Date('2026-11-02T13:00:00Z');
    check(lang, [
      ...screen.welcome(),
      ...screen.mainMenu(ctx),
      ...screen.mainMenu(ctx, 'at_pickup'),
      ...screen.settings(ctx),
      ...screen.arrived(ctx, now, 'DC', { freeMinutes: 120, ratePerHourCents: 5000 }),
      ...screen.freeTimeOver(ctx, now),
      ...screen.emailDraft(ctx, { to: 'a@b.c', subject: 's', body: 'b' }),
      ...screen.brokerReply(ctx, { summary: 's', meaning: 'm', offeredCents: 123_456 }),
      ...screen.confirmDelete(ctx),
      ...screen.voiceNotUnderstood(ctx),
      ...screen.rateconUnreadable(ctx, 2),
      ...screen.onboardingDone(ctx, 'Ivan'),
      ...screen.loadSaved(ctx, '1'),
    ]);
    for (const stage of STAGES) check(lang, [buttons('x', withMenu(nextActions(stage, t(lang)), t(lang)))]);
  }
  assert.deepEqual(tooLong, []);
});

test('all languages define the same keys', () => {
  const keys = (o: object): string[] =>
    Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v).map((x) => `${k}.${x}`) : [k])).sort();
  const reference = keys(STRINGS.en);
  for (const lang of LANGS) assert.deepEqual(keys(STRINGS[lang]), reference, lang);
});

test('money looks like a rate con', () => {
  assert.equal(formatMoney(5000), '$50');
  assert.equal(formatMoney(215_000), '$2,150');
  assert.equal(formatMoney(17_917), '$179.17');
});
