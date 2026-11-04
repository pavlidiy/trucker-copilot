import type { RateconExtract } from '../src/ai/ratecon.ts';

/** A rate con as Muse Spark would return it: risky terms, good pay. */
const none = { present: false, amount_usd: null, quote: null, page: null };
export const sample = (patch: Partial<RateconExtract> = {}): RateconExtract => ({
  is_rate_confirmation: true,
  load_number: '8841207',
  broker_name: 'Swift Brokerage LLC',
  broker_email: 'dispatch@example.com',
  pickup: { facility_name: 'Walmart DC 7035', address: null, city: 'Atlanta', state: 'GA', appointment: '11/02 08:00' },
  delivery: { facility_name: 'Kroger', address: null, city: 'Dallas', state: 'TX', appointment: '11/03 14:00' },
  rate_usd: 2150,
  miles: 781,
  detention: { ...none, free_hours: null },
  late_fee: { present: true, amount_usd: 250, quote: '$250 fine for late arrival', page: 2 },
  tonu: none,
  lumper: { paid_by: 'carrier', reimbursed: true, quote: 'Lumper reimbursed with receipt', page: 2 },
  ...patch,
});
