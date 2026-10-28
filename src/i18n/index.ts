import { en } from './en.ts';
import { ru } from './ru.ts';
import type { Strings } from './strings.ts';

export type { Strings } from './strings.ts';

// Add a language by writing its table next to en.ts and listing it here.
// Target: the same 11 languages as Truck Driver Helper.
export const STRINGS = { en, ru } satisfies Record<string, Strings>;

export type Lang = keyof typeof STRINGS;

export const LANGS = Object.keys(STRINGS) as Lang[];

export function isLang(value: string): value is Lang {
  return value in STRINGS;
}

export function t(lang: Lang): Strings {
  return STRINGS[lang];
}

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const dollarsAndCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** US dollars in US format, as on the rate con: "$50", "$2,150", "$179.17". */
export function formatMoney(cents: number): string {
  return (cents % 100 === 0 ? dollars : dollarsAndCents).format(cents / 100);
}

/** 24-hour clock in the stop's time zone, e.g. "08:12". */
export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(date);
}

export function formatDuration(s: Strings, totalMinutes: number): string {
  return s.common.duration(Math.floor(totalMinutes / 60), totalMinutes % 60);
}
