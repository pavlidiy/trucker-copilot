import type { DetentionTerms } from '../domain/detention.ts';
import { DEFAULT_TIME_ZONE, timeZoneFor } from '../domain/timezone.ts';
import type { LoadStage, LoadSummary, StopKind } from '../domain/types.ts';
import { isLang, type Lang } from '../i18n/index.ts';
import { ID, parseParam } from '../ui/ids.ts';
import * as screen from '../ui/screens.ts';
import { currentStop } from '../ui/stage.ts';
import type { OutgoingMessage } from '../wa/types.ts';
import type { Db, Driver, Load } from './db.ts';
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
  | 'openStop'
  | 'createStop'
  | 'closeStop'
>;

export async function route(store: Store, msg: InboundMessage, now = new Date()): Promise<OutgoingMessage[]> {
  const driver = await store.getDriver(msg.from);
  if (!driver) {
    await store.createDriver(msg.from);
    return screen.welcome();
  }
  const action = actionOf(msg);

  if (driver.onboarding_step !== 'done' || !driver.lang) return onboarding(store, driver, msg, action);

  const ctx: screen.Ctx = { lang: driver.lang, timeZone: DEFAULT_TIME_ZONE };
  const [load] = await store.recentLoads(driver.wa_id, 1);

  if (msg.type === 'location' && msg.location) {
    return onLocation(store, driver, ctx, load, msg.location, now);
  }
  if (msg.type === 'image' || msg.type === 'document') {
    // Rate con / BOL reading arrives with the Muse Spark step; until then, say what the bot can do.
    return [...screen.rateconReading(ctx), ...screen.help(ctx, load?.stage)];
  }
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
    case ID.recovered:
      return screen.recovered(ctx, '', 0, 0);
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
    detentionCents: 0, // per-stop detention sums come with the claims step
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
