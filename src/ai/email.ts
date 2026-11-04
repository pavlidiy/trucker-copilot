// Letters to the broker and reading the broker's answer, with Muse Spark.
// Numbers (minutes, dollars, times) are computed in code and handed to the model as facts;
// the model only writes English around them and explains things back in the driver's language.

import { museJson, nullable, object, type DocumentPart, type MuseConfig } from './muse.ts';

export type LetterKind =
  | 'detention_notice' // free time is over and the driver is still waiting: put the broker on notice
  | 'detention_claim' // after the stop: pay me for the hours I waited
  | 'ratecon_changes' // before booking: add detention / remove the fine
  | 'counter'; // the broker offered less: ask for the full amount

export interface StopFact {
  kind: 'pickup' | 'delivery';
  place: string;
  arrived: string; // "11/02 08:12", local to the facility
  left: string;
  timeZone: string;
  waitedMinutes: number;
  billableMinutes: number;
  amountUsd: number;
}

export interface LetterFacts {
  kind: LetterKind;
  driverName: string;
  company: string | null;
  loadNumber: string;
  broker: string | null;
  stops: StopFact[];
  freeHours: number;
  ratePerHourUsd: number;
  totalUsd: number;
  /** Exact clauses from the rate con that back the claim (or that we want changed). */
  rateconQuotes: string[];
  /** What we want changed before booking, in plain English (ratecon_changes). */
  asks: string[];
  /** What the broker offered (counter). */
  offeredUsd: number | null;
}

export interface Letter {
  subject: string;
  body: string; // English
  translation: string; // short retelling in the driver's language
}

const LETTER_SCHEMA = object({
  subject: { type: 'string' },
  body: { type: 'string', description: 'The email body in English, plain text, no markdown' },
  translation: {
    type: 'string',
    description: "2-4 short sentences in the driver's language: what the letter says and asks for",
  },
});

const LETTER_INSTRUCTIONS = `You write emails from a US truck driver to a freight broker. The driver's English is weak, you write for them.
Tone: polite, short, firm, professional. No threats, no legal language, no apologies.
Use ONLY the facts given (times, minutes, dollars, quotes). Never invent numbers, names, clauses or promises.
Quote rate con clauses word for word when given. State the amount and what you ask the broker to do.
Sign with the driver's name and company. Under 150 words. Plain text: no markdown, no placeholders like [Name].
Then retell the letter for the driver in their language in the "translation" field.`;

export function writeLetter(
  cfg: MuseConfig,
  facts: LetterFacts,
  driverLanguage: string,
  edit?: { previous: Letter; instruction: string },
): Promise<Letter> {
  const text = [
    `Driver's language: ${driverLanguage}.`,
    `Facts (JSON): ${JSON.stringify(facts)}`,
    edit &&
      `Rewrite this letter. Keep the facts. The driver asks (their words, any language): "${edit.instruction}"\n\n` +
        `Subject: ${edit.previous.subject}\n\n${edit.previous.body}`,
  ]
    .filter(Boolean)
    .join('\n\n');
  return museJson<Letter>(cfg, { name: 'BrokerEmail', instructions: LETTER_INSTRUCTIONS, text, schema: LETTER_SCHEMA });
}

export interface BrokerAnswer {
  is_broker_message: boolean;
  summary: string; // in the driver's language
  meaning: string; // in the driver's language: what it means for them, what to do
  offered_usd: number | null;
  agreed_full: boolean;
}

const ANSWER_SCHEMA = object({
  is_broker_message: { type: 'boolean', description: 'False if this is not a message from a broker or shipper' },
  summary: { type: 'string', description: "One or two sentences in the driver's language: what the broker wrote" },
  meaning: {
    type: 'string',
    description: "One sentence in the driver's language: what it means for the driver and the next step",
  },
  offered_usd: { ...nullable('number'), description: 'Amount the broker agrees to pay, if stated' },
  agreed_full: { type: 'boolean', description: 'True if the broker agrees to pay the full amount claimed' },
});

const ANSWER_INSTRUCTIONS = `You help a US truck driver with weak English understand a broker's email or chat message.
Explain it simply in the driver's language. Be exact about money, deadlines and documents the broker asks for
(BOL, lumper receipt, timestamps, POD). Do not add advice the message does not support.`;

export function readBrokerAnswer(
  cfg: MuseConfig,
  input: { text?: string; parts?: DocumentPart[] },
  context: { driverLanguage: string; claimedUsd: number | null },
): Promise<BrokerAnswer> {
  const text = [
    `Driver's language: ${context.driverLanguage}.`,
    context.claimedUsd != null && `The driver claimed $${context.claimedUsd} for detention.`,
    input.text ? `Broker's message:\n${input.text}` : "The broker's message is in the attached screenshot.",
  ]
    .filter(Boolean)
    .join('\n');
  return museJson<BrokerAnswer>(cfg, {
    name: 'BrokerAnswer',
    instructions: ANSWER_INSTRUCTIONS,
    text,
    parts: input.parts,
    schema: ANSWER_SCHEMA,
    effort: 'minimal',
  });
}

/** English names for the prompt; the model writes in the language, not the code. */
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', ru: 'Russian', uk: 'Ukrainian', zh: 'Simplified Chinese', hi: 'Hindi', es: 'Spanish',
  ar: 'Arabic', fr: 'French', bn: 'Bengali', pt: 'Portuguese', id: 'Indonesian', pa: 'Punjabi (Gurmukhi)',
  uz: 'Uzbek (Latin)', pl: 'Polish', ro: 'Romanian', tr: 'Turkish', ht: 'Haitian Creole',
};
