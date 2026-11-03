// Free text or a transcribed voice note, in any language → one of the bot's actions.
// "Я на складе", "ya llegué", "ਮੈਂ ਪਹੁੰਚ ਗਿਆ" all mean "arrived".

import { museJson, object, type MuseConfig } from './muse.ts';

export const INTENTS = [
  'arrived', // at the shipper/receiver
  'left', // loaded/unloaded and left
  'how_long', // how long have I been waiting, how much detention so far
  'email_broker', // write to the broker about detention
  'warn_broker', // tell the broker free time is over
  'check_ratecon', // wants to check a rate con
  'loads', // my loads
  'recovered', // money recovered
  'menu',
  'help',
  'other',
] as const;

export type Intent = (typeof INTENTS)[number];

const SCHEMA = object({ intent: { type: 'string', enum: INTENTS } });

const INSTRUCTIONS = `You route messages from a US truck driver to a WhatsApp assistant. The message can be in any language,
often transcribed from voice, with typos. Pick the single intent that fits. Use "other" if unsure.
arrived: at the facility, at the dock, checked in. left: loaded/unloaded, leaving, got paperwork.
how_long: asks how long they waited or how much detention so far. email_broker: wants to ask the broker for detention money.
warn_broker: wants to tell the broker they are still waiting. check_ratecon: wants a rate confirmation checked.`;

export async function understand(cfg: MuseConfig, text: string, stage: string | undefined): Promise<Intent> {
  const out = await museJson<{ intent: Intent }>(cfg, {
    name: 'DriverIntent',
    instructions: INSTRUCTIONS,
    text: `Current load stage: ${stage ?? 'none'}.\nMessage: ${text}`,
    schema: SCHEMA,
    effort: 'minimal',
  });
  return INTENTS.includes(out.intent) ? out.intent : 'other';
}
