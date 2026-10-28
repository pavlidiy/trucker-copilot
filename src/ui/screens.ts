import { computeDetention, freeTimeEndsAt, type DetentionTerms } from '../domain/detention.ts';
import type { BrokerReply, LoadStage, LoadSummary, RateconAnalysis, StopKind } from '../domain/types.ts';
import { formatDuration, formatMoney, formatTime, LANGS, t, type Lang, type Strings } from '../i18n/index.ts';
import { buttons, ctaUrl, list, locationRequest, paginate, text } from '../wa/builders.ts';
import type { OutgoingMessage } from '../wa/types.ts';
import { ID, langId, langPageId, loadId } from './ids.ts';
import { isOnSite, nextActions, withMenu } from './stage.ts';

// One function per screen from the "Интерфейс бота" spec. Each returns the messages to send,
// in order. Screens never compute money or time themselves beyond formatting: see domain/.

export interface Ctx {
  lang: Lang;
  timeZone: string; // the stop's IANA zone, e.g. "America/New_York"
}

const s = (ctx: Ctx): Strings => t(ctx.lang);

// ── Onboarding ────────────────────────────────────────────────────────────────

/** First message ever. Written in English plus the picker, since we don't know the language yet. */
export function welcome(page = 0): OutgoingMessage[] {
  const e = t('en');
  const rows = LANGS.map((l) => ({ id: langId(l), title: t(l).langName }));
  const pageRows = paginate(rows, page, (next) => ({ id: langPageId(next), title: e.common.more }));
  const pickerBody = LANGS.map((l) => t(l).onboarding.chooseLanguage).join(' / ');
  return [
    ...(page === 0 ? [text(e.onboarding.welcome)] : []),
    list(pickerBody, e.onboarding.chooseLanguageButton, [{ rows: pageRows }]),
  ];
}

export function askName(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).onboarding.askName)];
}

export function askCompany(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).onboarding.askCompany)];
}

export function askEmail(ctx: Ctx): OutgoingMessage[] {
  return [buttons(s(ctx).onboarding.askEmail, [{ id: ID.onboardingSkip, title: s(ctx).common.skip }])];
}

export function disclaimer(ctx: Ctx): OutgoingMessage[] {
  return [buttons(s(ctx).onboarding.disclaimer, [{ id: ID.disclaimerOk, title: s(ctx).common.gotIt }])];
}

export function onboardingDone(ctx: Ctx, name: string): OutgoingMessage[] {
  const str = s(ctx);
  return [
    buttons(str.onboarding.done(name), [
      { id: ID.rateconCheck, title: str.onboarding.sendRateconButton },
      { id: ID.menu, title: str.common.menu },
    ]),
  ];
}

// ── Main menu (variant C: six rows) ──────────────────────────────────────────

export function mainMenu(ctx: Ctx, stage?: LoadStage): OutgoingMessage[] {
  const m = s(ctx).menu;
  const facility = isOnSite(stage)
    ? { id: ID.stopLeave, title: m.leftFacility, description: m.facilityDesc }
    : { id: ID.stopArrive, title: m.atFacility, description: m.facilityDesc };
  return [
    list(m.title, m.button, [
      {
        rows: [
          { id: ID.rateconCheck, title: m.checkRatecon, description: m.checkRateconDesc },
          facility,
          { id: ID.emailDraft, title: m.broker, description: m.brokerDesc },
          { id: ID.loads, title: m.myLoads, description: m.myLoadsDesc },
          { id: ID.recovered, title: m.recovered, description: m.recoveredDesc },
          { id: ID.settings, title: m.settings, description: m.settingsDesc },
        ],
      },
    ]),
  ];
}

// ── Rate con check ───────────────────────────────────────────────────────────

export function rateconReading(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).ratecon.reading)];
}

export function rateconUnreadable(ctx: Ctx, page: number): OutgoingMessage[] {
  const r = s(ctx).ratecon;
  return [
    buttons(r.unreadable(page), [
      { id: ID.rateconRetry, title: r.takePhotoAgain },
      { id: ID.rateconContinue, title: r.continueWithout },
    ]),
  ];
}

export function rateconResult(ctx: Ctx, a: RateconAnalysis): OutgoingMessage[] {
  const str = s(ctx);
  const r = str.ratecon;
  const rpm = a.miles > 0 ? formatMoney(Math.round(a.rateCents / a.miles)) : '—';
  const lines = [
    `📄 *#${a.loadNumber}* · ${r.route(placeLabel(a.pickup), placeLabel(a.delivery))}`,
    `💵 ${formatMoney(a.rateCents)} · ${a.miles} mi · *${rpm}/mi*`,
    '',
    ...a.risks.map((risk) => {
      const line = r.risk[risk.code](risk.amountCents !== undefined ? formatMoney(risk.amountCents) : undefined);
      return risk.ref ? `${line} (${risk.ref})` : line;
    }),
  ];

  const rep = a.pickupReputation;
  const out: OutgoingMessage[] = [];
  if (rep?.slow) {
    lines.push(
      '',
      r.reputation(rep.rating, rep.reviewQuote, rep.avgWaitMinutes ? formatDuration(str, rep.avgWaitMinutes) : undefined),
      r.recommendDetention(formatMoney(5000)),
    );
  }
  out.push(buttons(lines.join('\n'), withMenu(nextActions('checked', str), str)));
  // Google's terms want reviews attributed and linked, so the source goes in its own button.
  if (rep?.mapsUrl) out.push(ctaUrl(r.reviewsSource, r.openReviews, rep.mapsUrl));
  return out;
}

export function loadSaved(ctx: Ctx, loadNumber: string): OutgoingMessage[] {
  const str = s(ctx);
  return [buttons(str.ratecon.saved(loadNumber), withMenu(nextActions('booked', str), str))];
}

// ── At the facility ──────────────────────────────────────────────────────────

export function askArriveLocation(ctx: Ctx, kind: StopKind): OutgoingMessage[] {
  return [locationRequest(s(ctx).stop.arrivePrompt(kind))];
}

export function askLeaveLocation(ctx: Ctx): OutgoingMessage[] {
  return [locationRequest(s(ctx).stop.leftPrompt)];
}

export function arrived(ctx: Ctx, at: Date, place: string, terms: DetentionTerms): OutgoingMessage[] {
  const st = s(ctx).stop;
  const body = st.arrived(
    formatTime(at, ctx.timeZone),
    place,
    formatTime(freeTimeEndsAt(at, terms), ctx.timeZone),
    formatMoney(terms.ratePerHourCents),
  );
  return [
    buttons(body, [
      { id: ID.stopLeave, title: st.leftButton },
      { id: ID.stopFixTime, title: st.fixTime },
    ]),
  ];
}

/** Sent by the timer when free time runs out. Outside the 24h window this must be a template. */
export function freeTimeOver(ctx: Ctx, at: Date): OutgoingMessage[] {
  const st = s(ctx).stop;
  return [
    buttons(st.freeTimeOver(formatTime(at, ctx.timeZone)), [
      { id: ID.stopWarnBroker, title: st.warnBroker },
      { id: ID.stopLeave, title: st.leftButton },
    ]),
  ];
}

export function detentionRunning(ctx: Ctx, arrivedAt: Date, now: Date, terms: DetentionTerms): OutgoingMessage[] {
  const str = s(ctx);
  const d = computeDetention(arrivedAt, now, terms);
  const body = str.stop.running(formatDuration(str, d.onSiteMinutes), formatMoney(d.amountCents));
  return [buttons(body, withMenu([{ id: ID.stopLeave, title: str.stop.leftButton }], str))];
}

export function left(ctx: Ctx, arrivedAt: Date, leftAt: Date, terms: DetentionTerms): OutgoingMessage[] {
  const str = s(ctx);
  const d = computeDetention(arrivedAt, leftAt, terms);
  const time = formatTime(leftAt, ctx.timeZone);
  const onSite = formatDuration(str, d.onSiteMinutes);
  if (d.amountCents === 0) {
    return [buttons(str.stop.noDetention(time, onSite), withMenu([], str))];
  }
  const body = str.stop.left(
    time,
    onSite,
    formatDuration(str, d.billableMinutes),
    formatMoney(terms.ratePerHourCents),
    formatMoney(d.amountCents),
  );
  return [buttons(body, withMenu(nextActions('left_delivery', str), str))];
}

export function bolChecked(ctx: Ctx, signedAt: Date, loggedAt: Date): OutgoingMessage[] {
  const str = s(ctx);
  const signed = formatTime(signedAt, ctx.timeZone);
  const logged = formatTime(loggedAt, ctx.timeZone);
  // Within 15 minutes counts as a match: drivers tap "I left" at the gate, not at the desk.
  const matches = Math.abs(signedAt.getTime() - loggedAt.getTime()) <= 15 * 60_000;
  const body = matches ? str.stop.bolMatches(signed) : str.stop.bolMismatch(signed, logged);
  return [buttons(body, withMenu([{ id: ID.emailDraft, title: str.email.writeToBroker }], str))];
}

// ── Broker email ─────────────────────────────────────────────────────────────

export interface EmailDraft {
  to: string;
  subject: string;
  body: string; // English, written by Muse Spark from our numbers
}

/** The draft, then a voice note with the translation (sent separately by the voice layer). */
export function emailDraft(ctx: Ctx, draft: EmailDraft): OutgoingMessage[] {
  const e = s(ctx).email;
  const preview = `${e.draftIntro(draft.to)}\n\n*Subject: ${draft.subject}*\n\n${draft.body}\n\n${e.translationNote}`;
  return [
    buttons(preview, [
      { id: ID.emailSend, title: e.send },
      { id: ID.emailCopy, title: e.copy },
      { id: ID.emailEdit, title: e.edit },
    ]),
  ];
}

export function emailEditPrompt(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).email.editPrompt)];
}

/** Copy mode: the letter alone in its own message, so a long press copies exactly the letter. */
export function emailCopy(ctx: Ctx, draft: EmailDraft): OutgoingMessage[] {
  return [text(s(ctx).email.copyIntro), text(`Subject: ${draft.subject}\n\n${draft.body}`)];
}

export function emailSent(ctx: Ctx, to: string, cc: string): OutgoingMessage[] {
  const str = s(ctx);
  return [buttons(str.email.sent(to, cc), withMenu([], str))];
}

export function brokerReply(ctx: Ctx, reply: BrokerReply): OutgoingMessage[] {
  const r = s(ctx).reply;
  const choices = [
    ...(reply.offeredCents !== undefined
      ? [{ id: ID.replyAccept, title: r.accept(formatMoney(reply.offeredCents)) }]
      : []),
    { id: ID.replyCounter, title: r.counter },
    { id: ID.replyCustom, title: r.custom },
  ];
  return [buttons(r.received(reply.summary, reply.meaning), choices)];
}

export function forwardBrokerHint(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).reply.forwardHint)];
}

// ── My loads, money recovered ────────────────────────────────────────────────

export function myLoads(ctx: Ctx, loads: LoadSummary[]): OutgoingMessage[] {
  const l = s(ctx).loads;
  if (loads.length === 0) return [buttons(l.empty, [{ id: ID.rateconCheck, title: s(ctx).menu.checkRatecon }])];
  const rows = loads.slice(0, 10).map((load) => ({
    id: loadId(load.loadNumber),
    title: `#${load.loadNumber} · ${l.stage[load.stage]}`,
    description: l.row(placeLabel(load.pickup), placeLabel(load.delivery)),
  }));
  return [list(l.title, l.button, [{ rows }])];
}

export function loadCard(ctx: Ctx, load: LoadSummary): OutgoingMessage[] {
  const str = s(ctx);
  const body = str.loads.card(
    load.loadNumber,
    str.ratecon.route(placeLabel(load.pickup), placeLabel(load.delivery)),
    str.loads.stage[load.stage],
    formatMoney(load.detentionCents),
  );
  return [buttons(body, withMenu(nextActions(load.stage, str), str))];
}

export function recovered(ctx: Ctx, month: string, totalCents: number, loads: number): OutgoingMessage[] {
  const str = s(ctx);
  const body = totalCents > 0 ? str.recovered.summary(month, formatMoney(totalCents), loads) : str.recovered.nothingYet;
  return [buttons(body, withMenu([], str))];
}

// ── Settings, help, errors ───────────────────────────────────────────────────

export function settings(ctx: Ctx): OutgoingMessage[] {
  const st = s(ctx).settings;
  return [
    list(st.title, st.button, [
      {
        rows: [
          { id: ID.setLanguage, title: st.language },
          { id: ID.setSignature, title: st.signature },
          { id: ID.setEmail, title: st.email },
          { id: ID.setRate, title: st.defaultRate },
          { id: ID.setVoice, title: st.voice },
          { id: ID.help, title: st.help },
          { id: ID.deleteData, title: st.deleteData },
        ],
      },
    ]),
  ];
}

export function confirmDelete(ctx: Ctx): OutgoingMessage[] {
  const str = s(ctx);
  return [
    buttons(str.settings.deleteConfirm, [
      { id: ID.deleteConfirm, title: str.settings.deleteYes },
      { id: ID.cancel, title: str.common.cancel },
    ]),
  ];
}

export function deleted(ctx: Ctx): OutgoingMessage[] {
  return [text(s(ctx).settings.deleted)];
}

export function help(ctx: Ctx, stage?: LoadStage): OutgoingMessage[] {
  const str = s(ctx);
  return [buttons(str.help.text, withMenu(nextActions(stage, str), str))];
}

export function voiceNotUnderstood(ctx: Ctx): OutgoingMessage[] {
  const str = s(ctx);
  return [
    buttons(str.errors.voiceNotUnderstood, [
      { id: ID.typeInstead, title: str.errors.typeInstead },
      { id: ID.menu, title: str.common.menu },
    ]),
  ];
}

export function genericError(ctx: Ctx): OutgoingMessage[] {
  const str = s(ctx);
  return [buttons(str.errors.generic, [{ id: ID.menu, title: str.common.menu }])];
}

function placeLabel(p: { city: string }): string {
  return p.city;
}
