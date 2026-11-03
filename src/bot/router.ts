import { LANGUAGE_NAMES, type BrokerAnswer, type Letter, type LetterFacts, type LetterKind } from '../ai/email.ts';
import type { RateconExtract } from '../ai/ratecon.ts';
import type { DetentionTerms } from '../domain/detention.ts';
import { DEFAULT_TIME_ZONE, timeZoneFor } from '../domain/timezone.ts';
import { toAnalysis } from '../domain/risks.ts';
import type { LoadStage, LoadSummary, StopKind } from '../domain/types.ts';
import { isLang, type Lang } from '../i18n/index.ts';
import { ID, parseParam } from '../ui/ids.ts';
import * as screen from '../ui/screens.ts';
import { currentStop } from '../ui/stage.ts';
import type { OutgoingMessage } from '../wa/types.ts';
import type { Db, Driver, Load } from './db.ts';
import { detentionCents, letterFacts } from './letters.ts';
import type { InboundMessage } from './whatsapp.ts';

// Turns one inbound WhatsApp message into the replies to send. All state is read from and
// written to the store, so a restart between two messages loses nothing.

export type Store = Pick<
  Db,
  | 'getDriver'
  | 'createDriver'
  | 'updateDriver'
  | 'deleteDriver'
  | 'recentLoads'
  | 'getLoad'
  | 'createLoad'
  | 'setLoadStage'
  | 'updateLoad'
  | 'stops'
  | 'openStop'
  | 'createStop'
  | 'closeStop'
>;

/** Outside world the router needs besides the store. Tests pass fakes. */
export interface Services {
  /** Downloads a photo/PDF from WhatsApp and has Muse Spark extract it. */
  readRatecon(media: { id: string; filename?: string }): Promise<RateconExtract>;
  /** Muse Spark writes the English letter from our facts and retells it in the driver's language. */
  writeLetter(facts: LetterFacts, language: string, edit?: { previous: Letter; instruction: string }): Promise<Letter>;
  /** Muse Spark explains a broker's email (pasted text or a screenshot) in the driver's language. */
  readBrokerAnswer(
    input: { text?: string; media?: { id: string; filename?: string } },
    context: { driverLanguage: string; claimedUsd: number | null },
  ): Promise<BrokerAnswer>;
  /** Sends replies right away, before the slow part (e.g. "Reading the document…"). */
  sendNow(msgs: OutgoingMessage[]): Promise<void>;
}

export async function route(store: Store, msg: InboundMessage, now = new Date(), services?: Services): Promise<OutgoingMessage[]> {
  const driver = await store.getDriver(msg.from);
  if (!driver) {
    await store.createDriver(msg.from);
    return screen.welcome();
  }
  const action = actionOf(msg);

  if (driver.onboarding_step !== 'done' || !driver.lang) return onboarding(store, driver, msg, action);

  const ctx: screen.Ctx = { lang: driver.lang, timeZone: DEFAULT_TIME_ZONE };
  const [load] = await store.recentLoads(driver.wa_id, 1);

  const typed = msg.type === 'text' && !action ? msg.text?.body.trim() : undefined;
  const media = msg.image ?? msg.document;
  if (services && load && driver.awaiting === 'letter_edit' && typed) {
    return editLetter(store, services, driver, ctx, load, typed);
  }
  if (services && load && driver.awaiting === 'broker_answer' && (typed || media)) {
    const answer = await onBrokerAnswer(store, services, driver, ctx, load, typed, media && { id: media.id, filename: msg.document?.filename });
    if (answer) return answer;
  }

  if (msg.type === 'location' && msg.location) {
    return onLocation(store, driver, ctx, load, msg.location, now);
  }
  if (media && services) return onRatecon(store, services, driver, ctx, { id: media.id, filename: msg.document?.filename });
  if (msg.type === 'audio') return screen.voiceNotUnderstood(ctx);

  const lang = action && parseParam(action, 'lang');
  if (lang && isLang(lang)) {
    await store.updateDriver(driver.wa_id, { lang });
    return screen.mainMenu({ ...ctx, lang }, load?.stage);
  }
  const langPage = action && parseParam(action, 'lang_page');
  if (langPage) return screen.welcome(Number(langPage), false);
  const loadNumber = action && parseParam(action, 'load');
  if (loadNumber) {
    const picked = await store.getLoad(driver.wa_id, loadNumber);
    return picked ? screen.loadCard(ctx, summary(picked)) : screen.mainMenu(ctx, load?.stage);
  }

  switch (action) {
    case ID.rateconCheck:
      return screen.askRatecon(ctx);
    case ID.rateconBook:
      if (!load) return screen.askRatecon(ctx);
      await store.setLoadStage(load.id, 'booked');
      return screen.loadSaved(ctx, load.load_number);
    case ID.stopArrive:
      return screen.askArriveLocation(ctx, nextStopKind(load?.stage));
    case ID.stopLeave:
      return screen.askLeaveLocation(ctx);
    case ID.stopHowLong: {
      const stop = load && (await store.openStop(load.id));
      if (!stop) return screen.mainMenu(ctx, load?.stage);
      return screen.detentionRunning({ ...ctx, timeZone: stop.time_zone }, new Date(stop.arrived_at), now, terms(load));
    }
    case ID.loads:
      return screen.myLoads(ctx, (await store.recentLoads(driver.wa_id, 10)).map(summary));
    case ID.rateconAskChanges:
      return load && services ? draftLetter(store, services, driver, ctx, load, 'ratecon_changes') : screen.askRatecon(ctx);
    case ID.stopWarnBroker:
      return load && services ? draftLetter(store, services, driver, ctx, load, 'detention_notice', { now }) : screen.mainMenu(ctx);
    case ID.emailDraft:
      return load && services ? draftLetter(store, services, driver, ctx, load, 'detention_claim') : screen.mainMenu(ctx);
    case ID.emailEdit:
      await store.updateDriver(driver.wa_id, { awaiting: 'letter_edit' });
      return screen.emailEditPrompt(ctx);
    case ID.emailSend:
    case ID.emailCopy:
      return load?.letter ? copyLetter(store, driver, ctx, load) : screen.mainMenu(ctx, load?.stage);
    case ID.replyAccept: {
      if (!load) return screen.mainMenu(ctx);
      const got = load.letter?.offeredCents ?? load.claimed_cents ?? 0;
      await store.updateLoad(load.id, { recovered_cents: got, stage: 'closed' });
      await store.updateDriver(driver.wa_id, { awaiting: null });
      return recoveredScreen(store, driver, ctx, now);
    }
    case ID.replyCounter:
      return load && services
        ? draftLetter(store, services, driver, ctx, load, 'counter', { offeredUsd: (load.letter?.offeredCents ?? 0) / 100 })
        : screen.mainMenu(ctx);
    case ID.replyCustom:
      await store.updateDriver(driver.wa_id, { awaiting: 'letter_edit' });
      return screen.emailEditPrompt(ctx);
    case ID.recovered:
      return recoveredScreen(store, driver, ctx, now);
    case ID.settings:
      return screen.settings(ctx);
    case ID.setLanguage:
      return screen.welcome(0, false);
    case ID.deleteData:
      return screen.confirmDelete(ctx);
    case ID.deleteConfirm:
      await store.deleteDriver(driver.wa_id);
      return screen.deleted(ctx);
    case ID.help:
      return screen.help(ctx, load?.stage);
    case ID.typeInstead:
      return [];
    default:
      // "Меню", "menu", "hi", or anything we can't act on yet: show the menu.
      return screen.mainMenu(ctx, load?.stage);
  }
}

async function onboarding(
  store: Store,
  driver: Driver,
  msg: InboundMessage,
  action: string | undefined,
): Promise<OutgoingMessage[]> {
  const lang = action && parseParam(action, 'lang');
  if (lang && isLang(lang)) {
    await store.updateDriver(driver.wa_id, { lang, onboarding_step: 'name' });
    return screen.askName(ctxFor(lang));
  }
  const page = action && parseParam(action, 'lang_page');
  if (page) return screen.welcome(Number(page), false);
  if (!driver.lang) return screen.welcome(0, false);

  const ctx = ctxFor(driver.lang);
  const typed = msg.type === 'text' ? msg.text?.body.trim() : undefined;

  switch (driver.onboarding_step) {
    case 'name':
      if (!typed) return screen.askName(ctx);
      await store.updateDriver(driver.wa_id, { name: typed.slice(0, 80), onboarding_step: 'company' });
      return screen.askCompany(ctx);
    case 'company':
      if (!typed) return screen.askCompany(ctx);
      await store.updateDriver(driver.wa_id, { company: typed.slice(0, 120), onboarding_step: 'email' });
      return screen.askEmail(ctx);
    case 'email':
      if (action === ID.onboardingSkip) {
        await store.updateDriver(driver.wa_id, { onboarding_step: 'disclaimer' });
        return screen.disclaimer(ctx);
      }
      if (!typed || !/^\S+@\S+\.\S+$/.test(typed)) return screen.askEmail(ctx);
      await store.updateDriver(driver.wa_id, { email: typed, onboarding_step: 'disclaimer' });
      return screen.disclaimer(ctx);
    case 'disclaimer':
      if (action !== ID.disclaimerOk) return screen.disclaimer(ctx);
      await store.updateDriver(driver.wa_id, { onboarding_step: 'done' });
      return screen.onboardingDone(ctx, firstName(driver.name));
    default:
      return screen.welcome(0, false);
  }
}

/** A photo or PDF is read as a rate con. Muse Spark extracts, code judges, and the load is saved as "checked". */
async function onRatecon(
  store: Store,
  services: Services,
  driver: Driver,
  ctx: screen.Ctx,
  media: { id: string; filename?: string },
): Promise<OutgoingMessage[]> {
  await services.sendNow(screen.rateconReading(ctx));
  const extract = await services.readRatecon(media);
  if (!extract.is_rate_confirmation) return screen.askRatecon(ctx);

  const analysis = toAnalysis(extract);
  const loadNumber = extract.load_number ?? manualLoadNumber(new Date());
  const existing = await store.getLoad(driver.wa_id, loadNumber);
  if (!existing) {
    await store.createLoad({
      wa_id: driver.wa_id,
      load_number: loadNumber,
      stage: 'checked',
      broker: analysis.broker || null,
      broker_email: analysis.brokerEmail ?? null,
      pickup: analysis.pickup,
      delivery: analysis.delivery,
      rate_cents: analysis.rateCents || null,
      miles: analysis.miles || null,
      analysis,
      ...detentionTerms(extract),
    });
  }
  return screen.rateconResult(ctx, { ...analysis, loadNumber });
}

/** The rate con's own detention terms when it states them; otherwise the table defaults apply. */
function detentionTerms(x: RateconExtract): { free_minutes?: number; detention_rate_cents?: number } {
  const out: { free_minutes?: number; detention_rate_cents?: number } = {};
  if (x.detention.present && x.detention.free_hours != null) out.free_minutes = Math.round(x.detention.free_hours * 60);
  if (x.detention.present && x.detention.amount_usd != null) out.detention_rate_cents = Math.round(x.detention.amount_usd * 100);
  return out;
}

/** Muse Spark writes the letter; we keep it on the load so "Edit" and "Copy" work on the same draft. */
async function draftLetter(
  store: Store,
  services: Services,
  driver: Driver,
  ctx: screen.Ctx,
  load: Load,
  kind: LetterKind,
  opts: { offeredUsd?: number; now?: Date } = {},
): Promise<OutgoingMessage[]> {
  await services.sendNow([{ type: 'text', text: { body: '✍️…' } }]);
  const stops = await store.stops(load.id);
  const facts = letterFacts(kind, driver, load, stops, opts);
  const letter = await services.writeLetter(facts, LANGUAGE_NAMES[ctx.lang] ?? 'English');
  const claimed = kind === 'detention_claim' ? Math.round(facts.totalUsd * 100) : load.claimed_cents ?? null;
  await store.updateLoad(load.id, { letter: { ...letter, kind, offeredCents: load.letter?.offeredCents }, claimed_cents: claimed });
  await store.updateDriver(driver.wa_id, { awaiting: null });
  return screen.emailDraft(ctx, { to: load.broker_email ?? load.broker ?? 'broker', ...letter });
}

async function editLetter(
  store: Store,
  services: Services,
  driver: Driver,
  ctx: screen.Ctx,
  load: Load,
  instruction: string,
): Promise<OutgoingMessage[]> {
  await services.sendNow([{ type: 'text', text: { body: '✍️…' } }]);
  const kind = load.letter?.kind ?? 'detention_claim';
  const facts = letterFacts(kind, driver, load, await store.stops(load.id), {
    offeredUsd: load.letter?.offeredCents !== undefined ? load.letter.offeredCents / 100 : undefined,
  });
  const language = LANGUAGE_NAMES[ctx.lang] ?? 'English';
  const letter = await services.writeLetter(facts, language, load.letter ? { previous: load.letter, instruction } : undefined);
  await store.updateLoad(load.id, { letter: { ...letter, kind, offeredCents: load.letter?.offeredCents } });
  await store.updateDriver(driver.wa_id, { awaiting: null });
  return screen.emailDraft(ctx, { to: load.broker_email ?? load.broker ?? 'broker', ...letter });
}

/** No mailer yet: the driver copies the letter into their own email. Then we wait for the broker's answer. */
async function copyLetter(store: Store, driver: Driver, ctx: screen.Ctx, load: Load): Promise<OutgoingMessage[]> {
  const letter = load.letter!;
  if (letter.kind === 'detention_claim' || letter.kind === 'counter') await store.setLoadStage(load.id, 'claim_sent');
  await store.updateDriver(driver.wa_id, { awaiting: 'broker_answer' });
  return [...screen.emailCopy(ctx, { to: load.broker_email ?? '', ...letter }), ...screen.forwardBrokerHint(ctx)];
}

/** Returns undefined when the message is not a broker's answer (e.g. a new rate con photo): routing goes on. */
async function onBrokerAnswer(
  store: Store,
  services: Services,
  driver: Driver,
  ctx: screen.Ctx,
  load: Load,
  typed: string | undefined,
  media: { id: string; filename?: string } | undefined,
): Promise<OutgoingMessage[] | undefined> {
  await services.sendNow(screen.rateconReading(ctx));
  const claimedUsd = load.claimed_cents != null ? load.claimed_cents / 100 : null;
  const answer = await services.readBrokerAnswer(
    { text: typed, media },
    { driverLanguage: LANGUAGE_NAMES[ctx.lang] ?? 'English', claimedUsd },
  );
  if (!answer.is_broker_message) return undefined;
  const offeredCents = answer.agreed_full
    ? load.claimed_cents ?? undefined
    : answer.offered_usd != null
      ? Math.round(answer.offered_usd * 100)
      : undefined;
  if (load.letter) await store.updateLoad(load.id, { letter: { ...load.letter, offeredCents } });
  return screen.brokerReply(ctx, { summary: answer.summary, meaning: answer.meaning, offeredCents });
}

async function recoveredScreen(store: Store, driver: Driver, ctx: screen.Ctx, now: Date): Promise<OutgoingMessage[]> {
  const month = now.toISOString().slice(0, 7);
  const loads = (await store.recentLoads(driver.wa_id, 100)).filter(
    (l) => (l.recovered_cents ?? 0) > 0 && l.created_at.slice(0, 7) === month,
  );
  const total = loads.reduce((sum, l) => sum + (l.recovered_cents ?? 0), 0);
  const monthName = new Intl.DateTimeFormat(ctx.lang, { month: 'long' }).format(now);
  return screen.recovered(ctx, monthName, total, loads.length);
}

/** A shared location means "I'm here" when no stop is open, and "I left" when one is. */
async function onLocation(
  store: Store,
  driver: Driver,
  ctx: screen.Ctx,
  load: Load | undefined,
  loc: NonNullable<InboundMessage['location']>,
  now: Date,
): Promise<OutgoingMessage[]> {
  const timeZone = timeZoneFor(loc.longitude);
  const open = load && (await store.openStop(load.id));
  if (load && open) {
    await store.closeStop(open.id, now);
    await store.setLoadStage(load.id, open.kind === 'pickup' ? 'left_pickup' : 'left_delivery');
    return screen.left({ ...ctx, timeZone: open.time_zone }, new Date(open.arrived_at), now, terms(load));
  }

  // Arriving without a checked rate con still gets logged: detention evidence matters more than paperwork.
  const active = load && load.stage !== 'left_delivery' && load.stage !== 'claim_sent' && load.stage !== 'closed';
  const target = active ? load : await store.createLoad({ wa_id: driver.wa_id, load_number: manualLoadNumber(now), stage: 'booked' });
  const kind = nextStopKind(target.stage);
  const place = loc.name ?? loc.address ?? `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  await store.createStop({
    load_id: target.id,
    kind,
    place_name: place,
    lat: loc.latitude,
    lng: loc.longitude,
    time_zone: timeZone,
    arrived_at: now.toISOString(),
  });
  await store.setLoadStage(target.id, kind === 'pickup' ? 'at_pickup' : 'at_delivery');
  return screen.arrived({ ...ctx, timeZone }, now, place, terms(target));
}

function actionOf(msg: InboundMessage): string | undefined {
  if (msg.type === 'interactive') return msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id;
  if (msg.type === 'text') {
    const body = msg.text?.body.trim().toLowerCase() ?? '';
    if (/^(☰|menu|меню|menú|menü|meni|menyu|菜单|मेनू|ਮੇਨੂ|মেনু|القائمة|meniu)$/.test(body)) return ID.menu;
  }
  return undefined;
}

function nextStopKind(stage: LoadStage | undefined): StopKind {
  return (stage && currentStop(stage)) ?? 'pickup';
}

function terms(load: Load): DetentionTerms {
  return { freeMinutes: load.free_minutes, ratePerHourCents: load.detention_rate_cents };
}

function summary(load: Load): LoadSummary {
  return {
    loadNumber: load.load_number,
    pickup: load.pickup ?? { name: '', city: '—' },
    delivery: load.delivery ?? { name: '', city: '—' },
    stage: load.stage,
    detentionCents: load.claimed_cents ?? 0,
  };
}

/** Loads logged without a rate con get a readable number like "M-1028-1347". */
function manualLoadNumber(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `M-${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}`;
}

function ctxFor(lang: Lang): screen.Ctx {
  return { lang, timeZone: DEFAULT_TIME_ZONE };
}

function firstName(name: string | null): string {
  return name?.split(/\s+/)[0] ?? '';
}
