// Free conversation: when a message is not one of the bot's actions, Muse Spark answers it like an
// experienced dispatcher friend would, instead of throwing the menu at the driver. It says honestly
// when something is outside what we can help with, asks one or two leading questions when a load is
// described without a rate con, and picks at most one bot action to offer as a button.

import { museJson, nullable, object, type MuseConfig } from './muse.ts';

export const SUGGESTIONS = ['none', 'check_ratecon', 'arrived', 'left', 'how_long', 'email_broker', 'loads'] as const;
export type Suggestion = (typeof SUGGESTIONS)[number];

/** Load details the driver told us in words, e.g. "Echo, $2,100, 850 miles, Dallas to Atlanta". */
export interface SpokenLoadFacts {
  broker: string | null;
  rate_usd: number | null;
  miles: number | null;
  pickup_city: string | null;
  delivery_city: string | null;
  detention_rate_usd: number | null;
  free_hours: number | null;
}

export interface AssistantReply {
  /** In the driver's language, short, WhatsApp-friendly. */
  reply: string;
  on_topic: boolean;
  suggest: Suggestion;
  /** Null unless the message (or the conversation) describes a concrete load. */
  load: SpokenLoadFacts | null;
}

export interface Turn {
  role: 'driver' | 'bot';
  text: string;
}

export interface AssistantContext {
  /** Language the driver picked, e.g. "Russian". */
  language: string;
  driverName: string | null;
  /** One-paragraph English description of the current load and stop, or null when there is none. */
  loadContext: string | null;
  history: Turn[];
}

const SCHEMA = object({
  reply: { type: 'string' },
  on_topic: { type: 'boolean' },
  suggest: { type: 'string', enum: SUGGESTIONS },
  // Always an object (strict schemas are simplest without unions); every field null = no details.
  load: object({
    broker: nullable('string'),
    rate_usd: nullable('number'),
    miles: nullable('number'),
    pickup_city: nullable('string'),
    delivery_city: nullable('string'),
    detention_rate_usd: nullable('number'),
    free_hours: nullable('number'),
  }),
});

const INSTRUCTIONS = `You are Trucker Copilot, a WhatsApp assistant for US truck drivers, many of them immigrants with weak English.
Think of yourself as an experienced dispatcher and fellow driver who is on the driver's side.

What the bot itself can do (buttons): read a rate confirmation photo/PDF and flag risks (no detention clause, late fines,
lumper on the driver, low rate per mile, missing TONU); log arrival/departure at a shipper or receiver and count detention
(usually 2 free hours, then an hourly rate); write a firm, polite English email to the broker for detention or rate con
changes; explain the broker's reply; keep the driver's loads and money recovered.

How to answer:
- Reply in the language of the driver's message. If it is unclear, use LANGUAGE. Use simple words, no jargon without explanation.
  Keep US trucking terms in English where drivers use them (rate con, BOL, detention, lumper, TONU, broker, dispatch, HOS, ELD).
- Be short: 2 to 6 short lines, under 700 characters. WhatsApp style: plain text, *bold* allowed, no headings, no tables.
- Answer the actual question first with practical, concrete advice for a US truck driver at work: detention and layover,
  lumper receipts, TONU, rate and rate per mile, negotiating with brokers, BOL and POD (check counts, seal numbers, times,
  write "shipper load and count", note damage before signing), check-in at docks, HOS and ELD basics, DOT inspections,
  weigh stations, parking, fuel, paperwork, and useful English phrases for the dock, the broker or police (give the phrase
  in English with the meaning in the driver's language).
- Never invent facts about a specific broker, facility, law or number you do not know. For legal, tax, medical, or
  exact HOS rule questions, give the general idea and say to check with dispatch, the company safety department or FMCSA.
- If the driver talks about a load and there is no rate con, do not ask for the rate con as a condition. Help with what
  they said, then ask ONE or TWO leading questions that move the work forward (who is the broker, rate and miles, where
  pickup and delivery are, appointment time, are detention terms written, are they already at the dock). Mention that a
  photo of the rate con lets you check it fully, as an option, not a requirement.
- If they are at a facility or waiting, remind them to log the arrival so detention is counted (suggest "arrived"), or to
  ask for "how_long" if a stop is already open.
- If the message is off topic (not about trucking work), set on_topic=false, say kindly in one or two lines that you are
  a helper for truck drivers' work and cannot help with that, and say what you can help with. Greetings and thanks are on
  topic: answer warmly and briefly and say what you can do.
- Never claim you did something (sent an email, logged a stop) — the driver does that with the buttons.
- Never write internal names like check_ratecon, email_broker, arrived or how_long in the reply. The suggested action
  appears as a button under your message, so say "tap the button below" in the driver's language instead.

suggest: the one bot action that helps most right now, or "none". check_ratecon when they have or talk about a rate con;
arrived when they are at or arriving at a shipper/receiver and no stop is open; left when a stop is open and they are
leaving; how_long when a stop is open and they ask about waiting; email_broker when they want money or changes from the
broker and there is a load; loads when they ask about their loads.

load: fill only when the driver gave concrete details of a load in this conversation (broker, rate, miles, cities,
detention terms); copy only numbers they said, null for anything not said. Keep
city and broker names as the driver wrote them. Otherwise every field null.`;

export async function converse(cfg: MuseConfig, message: string, ctx: AssistantContext): Promise<AssistantReply> {
  const history = ctx.history.map((t) => `${t.role === 'driver' ? 'Driver' : 'You'}: ${t.text}`).join('\n');
  const out = await museJson<AssistantReply>(cfg, {
    name: 'DriverAssistant',
    instructions: INSTRUCTIONS.replace('LANGUAGE', ctx.language),
    text: [
      `Driver's language setting: ${ctx.language}. Driver's name: ${ctx.driverName ?? 'unknown'}.`,
      `Current load: ${ctx.loadContext ?? 'none'}.`,
      history ? `Recent conversation:\n${history}` : 'No earlier conversation.',
      `Driver's new message: ${message}`,
    ].join('\n\n'),
    schema: SCHEMA,
    effort: 'low',
  });
  return {
    reply: (out.reply ?? '').trim(),
    on_topic: out.on_topic !== false,
    suggest: SUGGESTIONS.includes(out.suggest) ? out.suggest : 'none',
    load: out.load && Object.values(out.load).some((v) => v != null) ? out.load : null,
  };
}
