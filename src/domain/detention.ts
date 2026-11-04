// Detention math lives here, in code, never in the model: the driver will quote these numbers to a broker.

export interface DetentionTerms {
  freeMinutes: number; // usually 120
  ratePerHourCents: number; // e.g. 5000 for $50/hr
}

export const DEFAULT_TERMS: DetentionTerms = { freeMinutes: 120, ratePerHourCents: 5000 };

export interface DetentionResult {
  onSiteMinutes: number;
  billableMinutes: number;
  amountCents: number;
}

/** Billed per minute after the free time, rounded to the nearest cent. */
export function computeDetention(arrivedAt: Date, leftAt: Date, terms: DetentionTerms): DetentionResult {
  const onSiteMinutes = Math.max(0, Math.floor((leftAt.getTime() - arrivedAt.getTime()) / 60_000));
  const billableMinutes = Math.max(0, onSiteMinutes - terms.freeMinutes);
  const amountCents = Math.round((billableMinutes * terms.ratePerHourCents) / 60);
  return { onSiteMinutes, billableMinutes, amountCents };
}

export function freeTimeEndsAt(arrivedAt: Date, terms: DetentionTerms): Date {
  return new Date(arrivedAt.getTime() + terms.freeMinutes * 60_000);
}
