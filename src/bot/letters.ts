import type { LetterFacts, LetterKind, StopFact } from '../ai/email.ts';
import { computeDetention, type DetentionTerms } from '../domain/detention.ts';
import type { RiskCode } from '../domain/types.ts';
import type { Driver, Load, Stop } from './db.ts';

// Facts for a broker letter, computed in code so the model never does arithmetic.

/** What we ask the broker to change before booking, per risk found in the rate con. */
const ASKS: Partial<Record<RiskCode, (terms: DetentionTerms) => string>> = {
  no_detention_clause: (t) =>
    `Add detention pay: $${t.ratePerHourCents / 100}/hour after ${t.freeMinutes / 60} free hours at each stop`,
  late_fine: () => 'Remove the late fee, or apply it only when the delay is caused by the carrier',
  lumper_on_driver: () => 'Broker pays the lumper directly (Comchek/EFS), or reimburses within 24 hours',
  tonu_missing: () => 'Add TONU (truck ordered, not used) pay of $150',
};

export function letterFacts(
  kind: LetterKind,
  driver: Driver,
  load: Load,
  stops: Stop[],
  opts: { offeredUsd?: number; now?: Date } = {},
): LetterFacts {
  const now = opts.now ?? new Date();
  const terms: DetentionTerms = { freeMinutes: load.free_minutes, ratePerHourCents: load.detention_rate_cents };
  // A stop still open (the driver is waiting right now) counts up to now: that is the notice case.
  const stopFacts: StopFact[] = stops
    .filter((s) => s.left_at || kind === 'detention_notice')
    .map((s) => {
      const d = computeDetention(new Date(s.arrived_at), s.left_at ? new Date(s.left_at) : now, terms);
      return {
        kind: s.kind,
        place: s.place_name ?? '',
        arrived: stamp(s.arrived_at, s.time_zone),
        left: s.left_at ? stamp(s.left_at, s.time_zone) : 'still on site, not loaded/unloaded yet',
        timeZone: s.time_zone,
        waitedMinutes: d.onSiteMinutes,
        billableMinutes: d.billableMinutes,
        amountUsd: d.amountCents / 100,
      };
    });
  const risks = load.analysis?.risks.map((r) => r.code) ?? [];
  return {
    kind,
    driverName: driver.name ?? '',
    company: driver.company,
    loadNumber: load.load_number,
    broker: load.broker,
    stops: kind === 'ratecon_changes' ? [] : stopFacts,
    freeHours: load.free_minutes / 60,
    ratePerHourUsd: load.detention_rate_cents / 100,
    totalUsd: stopFacts.reduce((sum, f) => sum + f.amountUsd, 0),
    rateconQuotes: [],
    asks: kind === 'ratecon_changes' ? risks.flatMap((code) => ASKS[code]?.(terms) ?? []) : [],
    offeredUsd: opts.offeredUsd ?? null,
  };
}

/** Detention owed on a load: the sum over its finished stops. */
export function detentionCents(load: Load, stops: Stop[]): number {
  const terms: DetentionTerms = { freeMinutes: load.free_minutes, ratePerHourCents: load.detention_rate_cents };
  return stops
    .filter((s) => s.left_at)
    .reduce((sum, s) => sum + computeDetention(new Date(s.arrived_at), new Date(s.left_at!), terms).amountCents, 0);
}

/** "11/02 08:12" in the facility's zone: what the broker sees on the BOL. */
function stamp(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('month')}/${get('day')} ${get('hour')}:${get('minute')} ${get('timeZoneName')}`;
}
