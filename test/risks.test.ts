import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessRatecon, toAnalysis } from '../src/domain/risks.ts';
import { sample } from './fixtures.ts';

test('risky rate con: red first, then yellow, with page refs', () => {
  const risks = assessRatecon(sample());
  assert.deepEqual(risks.map((r) => r.code), ['no_detention_clause', 'late_fine', 'lumper_on_driver', 'tonu_missing', 'good_rate']);
  assert.equal(risks[1]!.amountCents, 25000);
  assert.equal(risks[1]!.ref, 'p. 2');
});

test('clean rate con with low pay', () => {
  const risks = assessRatecon(sample({
    rate_usd: 1200,
    detention: { present: true, amount_usd: 50, quote: '$50/hr after 2 hours', page: 1, free_hours: 2 },
    late_fee: { present: false, amount_usd: null, quote: null, page: null },
    tonu: { present: true, amount_usd: 150, quote: 'TONU $150', page: 1 },
    lumper: { paid_by: 'broker', reimbursed: null, quote: null, page: null },
  }));
  assert.deepEqual(risks.map((r) => r.code), ['low_rpm']);
});

test('analysis fills route and money', () => {
  const a = toAnalysis(sample());
  assert.equal(a.rateCents, 215000);
  assert.equal(a.pickup.city, 'Atlanta, GA');
  assert.equal(a.broker, 'Swift Brokerage LLC');
});

test('detention "none unless approved" still counts as no detention pay', () => {
  const risks = assessRatecon(sample({
    detention: { present: true, amount_usd: null, quote: 'Detention: none unless approved in writing by broker', page: 2, free_hours: null },
  }));
  assert.equal(risks[0]!.code, 'no_detention_clause');
  assert.equal(risks[0]!.ref, 'p. 2');
});
