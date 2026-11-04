import assert from 'node:assert/strict';
import { test } from 'node:test';
import { computeDetention, DEFAULT_TERMS, freeTimeEndsAt } from '../src/domain/detention.ts';

const at = (hhmm: string) => new Date(`2026-11-02T${hhmm}:00Z`);

test('bills per minute after two free hours', () => {
  const d = computeDetention(at('08:12'), at('13:47'), DEFAULT_TERMS);
  assert.deepEqual(d, { onSiteMinutes: 335, billableMinutes: 215, amountCents: 17917 });
});

test('nothing within free time', () => {
  assert.equal(computeDetention(at('08:00'), at('09:59'), DEFAULT_TERMS).amountCents, 0);
});

test('leaving before arriving never goes negative', () => {
  assert.equal(computeDetention(at('10:00'), at('09:00'), DEFAULT_TERMS).onSiteMinutes, 0);
});

test('free time ends two hours after arrival', () => {
  assert.equal(freeTimeEndsAt(at('08:12'), DEFAULT_TERMS).toISOString(), at('10:12').toISOString());
});
