import type { RateconExtract } from '../ai/ratecon.ts';
import type { RateconAnalysis, Risk } from './types.ts';

// Rate-per-mile bands for a quick verdict. Rough dry-van numbers; a lane-rate source can replace them.
const LOW_RPM_CENTS = 200;
const GOOD_RPM_CENTS = 275;

const cents = (usd: number | null | undefined) => (usd == null ? undefined : Math.round(usd * 100));
const ref = (page: number | null) => (page ? `p. ${page}` : undefined);

/** Turns what the document says into the risks we show, worst first. */
export function assessRatecon(x: RateconExtract): Risk[] {
  const risks: Risk[] = [];
  // "Detention: none unless approved in writing" is a clause, but it promises nothing: no rate means no pay.
  if (!x.detention.present || !x.detention.amount_usd) {
    risks.push({ level: 'red', code: 'no_detention_clause', ref: ref(x.detention.page) });
  }
  if (x.late_fee.present) {
    risks.push({ level: 'red', code: 'late_fine', amountCents: cents(x.late_fee.amount_usd), ref: ref(x.late_fee.page) });
  }
  if (x.lumper.paid_by === 'driver' || (x.lumper.paid_by === 'carrier' && x.lumper.reimbursed !== false)) {
    risks.push({ level: 'yellow', code: 'lumper_on_driver', ref: ref(x.lumper.page) });
  }
  if (!x.tonu.present) risks.push({ level: 'yellow', code: 'tonu_missing' });

  const rpm = rpmCents(x);
  if (rpm !== undefined && rpm < LOW_RPM_CENTS) risks.push({ level: 'yellow', code: 'low_rpm' });
  if (rpm !== undefined && rpm >= GOOD_RPM_CENTS) risks.push({ level: 'green', code: 'good_rate' });
  return risks;
}

export function toAnalysis(x: RateconExtract): RateconAnalysis {
  return {
    loadNumber: x.load_number ?? '—',
    broker: x.broker_name ?? '',
    brokerEmail: x.broker_email ?? undefined,
    pickup: { name: x.pickup.facility_name ?? '', city: place(x.pickup) },
    delivery: { name: x.delivery.facility_name ?? '', city: place(x.delivery) },
    rateCents: cents(x.rate_usd) ?? 0,
    miles: x.miles ?? 0,
    risks: assessRatecon(x),
  };
}

function rpmCents(x: RateconExtract): number | undefined {
  if (!x.rate_usd || !x.miles) return undefined;
  return Math.round((x.rate_usd * 100) / x.miles);
}

function place(s: RateconExtract['pickup']): string {
  return [s.city, s.state].filter(Boolean).join(', ') || '—';
}
