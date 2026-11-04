import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Driver, Load, Stop } from '../src/bot/db.ts';
import { route, type Services, type Store } from '../src/bot/router.ts';
import type { InboundMessage } from '../src/bot/whatsapp.ts';
import { ID } from '../src/ui/ids.ts';
import { render } from '../src/wa/render.ts';
import { sample } from './fixtures.ts';

/** In-memory stand-in for the Supabase tables. */
function memoryStore() {
  const drivers = new Map<string, Driver>();
  const loads: Load[] = [];
  const stops: Stop[] = [];
  let seq = 0;
  const store: Store = {
    async getDriver(id) { return drivers.get(id); },
    async createDriver(id) {
      const d: Driver = { wa_id: id, lang: null, onboarding_step: 'language', name: null, company: null, email: null };
      drivers.set(id, d);
      return d;
    },
    async updateDriver(id, patch) { Object.assign(drivers.get(id)!, patch); },
    async deleteDriver(id) { drivers.delete(id); },
    async recentLoads(id, limit = 10) { return loads.filter((l) => l.wa_id === id).reverse().slice(0, limit); },
    async getLoad(id, n) { return loads.find((l) => l.wa_id === id && l.load_number === n); },
    async createLoad(l) {
      const load: Load = {
        id: `load${++seq}`, broker: null, broker_email: null, pickup: null, delivery: null, rate_cents: null, miles: null,
        detention_rate_cents: 5000, free_minutes: 120, analysis: null, created_at: new Date().toISOString(), ...l,
      };
      loads.push(load);
      return load;
    },
    async setLoadStage(id, stage) { loads.find((l) => l.id === id)!.stage = stage; },
    async updateLoad(id, patch) { Object.assign(loads.find((l) => l.id === id)!, patch); },
    async stops(loadId) { return stops.filter((s) => s.load_id === loadId); },
    async openStop(loadId) { return stops.find((s) => s.load_id === loadId && !s.left_at); },
    async createStop(s) { const stop = { ...s, id: `stop${++seq}`, left_at: null }; stops.push(stop); return stop; },
    async closeStop(id, at) { stops.find((s) => s.id === id)!.left_at = at.toISOString(); },
  };
  return { store, drivers, loads, stops };
}

const from = '17135550100';
let n = 0;
const text = (body: string): InboundMessage => ({ from, id: `m${++n}`, timestamp: '0', type: 'text', text: { body } });
const tap = (id: string): InboundMessage => ({ from, id: `m${++n}`, timestamp: '0', type: 'interactive', interactive: { type: 'button_reply', button_reply: { id, title: id } } });
const pick = (id: string): InboundMessage => ({ from, id: `m${++n}`, timestamp: '0', type: 'interactive', interactive: { type: 'list_reply', list_reply: { id, title: id } } });
const location = (lng: number): InboundMessage => ({ from, id: `m${++n}`, timestamp: '0', type: 'location', location: { latitude: 33.7, longitude: lng, name: 'Walmart DC 7035' } });
const noMuse: Services = {
  async readRatecon() { throw new Error('not expected'); },
  async writeLetter() { throw new Error('not expected'); },
  async readBrokerAnswer() { throw new Error('not expected'); },
  async transcribe() { throw new Error('not expected'); },
  async understand() { return 'other'; },
  async converse() { throw new Error('not expected'); },
  async sendNow() {},
};
const show = (msgs: Awaited<ReturnType<typeof route>>) => msgs.map(render).join('\n---\n');

test('onboarding to arrive/leave with detention', async () => {
  const { store, drivers, stops } = memoryStore();

  assert.match(show(await route(store, text('Hi'))), /Choose your language/);
  assert.match(show(await route(store, pick('lang:ru'))), /Как вас зовут/);
  assert.match(show(await route(store, text('Ivan Petrov'))), /компании/);
  assert.match(show(await route(store, text('MC 1234567'))), /email/);
  assert.match(show(await route(store, text('not an email'))), /email/); // asked again
  assert.match(show(await route(store, text('ivan@example.com'))), /не юрист/);
  assert.match(show(await route(store, tap(ID.disclaimerOk))), /Готово, Ivan!/);
  assert.equal(drivers.get(from)?.onboarding_step, 'done');

  assert.match(show(await route(store, text('меню'))), /Проверить рейт кон/);

  const arrivedAt = new Date('2026-11-02T13:12:00Z'); // 08:12 in Atlanta
  const arrived = show(await route(store, location(-84.4), arrivedAt));
  assert.match(arrived, /приехали в \*08:12\*/);
  assert.match(arrived, /до \*10:12\*/);
  assert.equal(stops.length, 1);

  const left = show(await route(store, location(-84.4), new Date('2026-11-02T18:47:00Z')));
  assert.match(left, /\$179\.17/);
  assert.ok(stops[0]!.left_at);
});

test('delete my data removes the driver', async () => {
  const { store, drivers } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  assert.match(show(await route(store, tap(ID.deleteData))), /cannot be undone/);
  await route(store, tap(ID.deleteConfirm));
  assert.equal(drivers.size, 0);
});

test('rate con photo is read, judged and saved as a checked load', async () => {
  const { store, loads } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const early: string[] = [];
  const services: Services = {
    ...noMuse,
    async readRatecon(media) { assert.equal(media.id, 'media1'); return sample(); },
    async sendNow(msgs) { early.push(show(msgs)); },
  };
  const photo: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'image', image: { id: 'media1', mime_type: 'image/jpeg' } };

  const result = show(await route(store, photo, new Date(), services));
  assert.match(early.join(), /Reading the document/);
  assert.match(result, /#8841207/);
  assert.match(result, /No guaranteed detention pay/);
  assert.match(result, /Late fee \$250/);
  assert.equal(loads[0]?.stage, 'checked');
  assert.equal(loads[0]?.rate_cents, 215000);

  assert.match(show(await route(store, tap(ID.rateconBook))), /8841207/);
  assert.equal(loads[0]?.stage, 'booked');
});

test('a photo that is not a rate con asks for one', async () => {
  const { store, loads } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const services: Services = { ...noMuse, async readRatecon() { return sample({ is_rate_confirmation: false }); } };
  const selfie: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'image', image: { id: 'x', mime_type: 'image/jpeg' } };
  assert.match(show(await route(store, selfie, new Date(), services)), /photo or PDF of the rate con/);
  assert.equal(loads.length, 0);
});

test('detention claim: letter from our numbers, copy, broker offers less, accept', async () => {
  const { store, loads } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'ru', onboarding_step: 'done', name: 'Ivan Petrov', company: 'Petrov Trucking' });
  await route(store, location(-84.4), new Date('2026-11-02T13:12:00Z'));
  await route(store, location(-84.4), new Date('2026-11-02T18:47:00Z'));

  let facts: Parameters<Services['writeLetter']>[0] | undefined;
  const services: Services = {
    ...noMuse,
    async writeLetter(f, language) {
      facts = f;
      assert.equal(language, 'Russian');
      return { subject: 'Detention', body: `Please pay $${f.totalUsd}.`, translation: 'Просим оплатить простой.' };
    },
    async readBrokerAnswer(input, context) {
      assert.match(input.text!, /pay \$100/);
      assert.equal(context.claimedUsd, 179.17);
      return { is_broker_message: true, summary: 'Брокер готов заплатить $100.', meaning: 'Меньше, чем вы просили.', offered_usd: 100, agreed_full: false };
    },
  };

  const draft = show(await route(store, tap(ID.emailDraft), new Date(), services));
  assert.equal(facts?.totalUsd, 179.17);
  assert.equal(facts?.stops[0]?.billableMinutes, 215);
  assert.match(facts!.stops[0]!.arrived, /11\/02 08:12 EST/);
  assert.match(draft, /Please pay \$179\.17/);
  assert.match(draft, /Просим оплатить простой/);

  const copied = show(await route(store, tap(ID.emailCopy), new Date(), services));
  assert.match(copied, /Subject: Detention/);
  assert.equal(loads[0]?.stage, 'claim_sent');

  const reply = show(await route(store, text('We can pay $100 for detention, final.'), new Date(), services));
  assert.match(reply, /Брокер готов заплатить \$100/);

  await route(store, tap(ID.replyAccept), new Date('2026-11-03T12:00:00Z'), services);
  assert.equal(loads[0]?.recovered_cents, 10000);
  assert.equal(loads[0]?.stage, 'closed');
});

test('voice note in Russian: transcribed, understood as "arrived", asks for location', async () => {
  const { store } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'ru', onboarding_step: 'done' });
  const early: string[] = [];
  const services: Services = {
    ...noMuse,
    async transcribe(media) { assert.equal(media.id, 'voice1'); return 'я приехал на склад'; },
    async understand(t) { assert.equal(t, 'я приехал на склад'); return 'arrived'; },
    async sendNow(msgs) { early.push(show(msgs)); },
  };
  const voice: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'audio', audio: { id: 'voice1', mime_type: 'audio/ogg; codecs=opus', voice: true } };
  const out = show(await route(store, voice, new Date(), services));
  assert.match(early.join(), /🎧 “я приехал на склад”/);
  assert.equal((await route(store, voice, new Date(), services)).at(-1)?.type, 'interactive');
  assert.ok(out.length > 0);
});

const noLoad = { broker: null, rate_usd: null, miles: null, pickup_city: null, delivery_city: null, detention_rate_usd: null, free_hours: null };

test('a question gets an answer with next-step buttons, not the menu', async () => {
  const { store } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'ru', onboarding_step: 'done', name: 'Ivan' });
  let seen: Parameters<Services['converse']>[2] | undefined;
  const services: Services = {
    ...noMuse,
    async converse(waId, t, context) {
      seen = context;
      assert.equal(waId, from);
      assert.equal(t, 'что такое TONU?');
      return { reply: 'TONU — это оплата, если груз отменили, когда вы уже приехали.', on_topic: true, suggest: 'check_ratecon', load: null };
    },
  };
  const out = await route(store, text('что такое TONU?'), new Date(), services);
  assert.equal(out.length, 1);
  const shown = show(out);
  assert.match(shown, /TONU — это оплата/);
  assert.match(shown, /\[📄 Проверить рейт кон\]/);
  assert.match(shown, /\[☰ Меню\]/);
  assert.doesNotMatch(shown, /▾/); // no list menu
  assert.equal(seen?.language, 'Russian');
  assert.equal(seen?.loadContext, null);
});

test('a load told in words, without a rate con, is saved and detention uses its terms', async () => {
  const { store, loads } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const services: Services = {
    ...noMuse,
    async converse() {
      return {
        reply: 'Got it. Is detention written in the rate con? When is your appointment?',
        on_topic: true,
        suggest: 'arrived',
        load: { ...noLoad, broker: 'Echo Global', rate_usd: 2100, miles: 850, pickup_city: 'Dallas, TX', delivery_city: 'Atlanta, GA', detention_rate_usd: 40 },
      };
    },
  };
  const out = show(await route(store, text('took a load with Echo, 2100 for 850 miles Dallas to Atlanta, detention 40/h'), new Date(), services));
  assert.match(out, /appointment/);
  assert.match(out, /\[📍 I'm here\]/);
  assert.equal(loads.length, 1);
  assert.equal(loads[0]?.broker, 'Echo Global');
  assert.equal(loads[0]?.rate_cents, 210000);
  assert.equal(loads[0]?.detention_rate_cents, 4000);
  assert.equal(loads[0]?.stage, 'booked');

  await route(store, location(-84.4), new Date('2026-11-02T13:12:00Z'));
  const left = show(await route(store, location(-84.4), new Date('2026-11-02T18:47:00Z')));
  assert.match(left, /\$143\.33/); // 215 billable minutes × $40/h
  assert.equal(loads.length, 1);
});

test('chat never overwrites what a checked rate con says', async () => {
  const { store, loads } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const photo: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'image', image: { id: 'media1', mime_type: 'image/jpeg' } };
  await route(store, photo, new Date(), { ...noMuse, async readRatecon() { return sample(); } });
  const services: Services = {
    ...noMuse,
    async converse(_w, _t, context) {
      assert.match(context.loadContext!, /rate con checked/);
      return { reply: 'ok', on_topic: true, suggest: 'none', load: { ...noLoad, rate_usd: 9999, detention_rate_usd: 100 } };
    },
  };
  await route(store, text('rate is 9999 and detention 100'), new Date(), services);
  assert.equal(loads[0]?.rate_cents, 215000);
  assert.equal(loads[0]?.detention_rate_cents, 5000);
});

test('"how long" with no open stop is answered, not sent to the menu', async () => {
  const { store } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const services: Services = {
    ...noMuse,
    async understand() { return 'how_long'; },
    async converse() { return { reply: 'You have no open stop. Tap I\'m here when you get to the dock.', on_topic: true, suggest: 'how_long', load: null }; },
  };
  const out = show(await route(store, text('how long am I waiting?'), new Date(), services));
  assert.match(out, /no open stop/);
  assert.doesNotMatch(out, /How long\?\]/); // the suggestion is dropped: there is no stop to time
});

test('text that is not the broker answer is still understood', async () => {
  const { store } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done', awaiting: 'broker_answer' });
  await store.createLoad({ wa_id: from, load_number: 'M-1', stage: 'claim_sent' });
  const services: Services = {
    ...noMuse,
    async readBrokerAnswer() { return { is_broker_message: false, summary: '', meaning: '', offered_usd: null, agreed_full: false }; },
    async converse() { return { reply: 'Brokers usually answer in 1-2 days. Forward their email when it comes.', on_topic: true, suggest: 'none', load: null }; },
  };
  assert.match(show(await route(store, text('when will the broker answer?'), new Date(), services)), /1-2 days/);
});

test('off-topic question gets an honest answer', async () => {
  const { store } = memoryStore();
  await route(store, text('Hi'));
  await store.updateDriver(from, { lang: 'en', onboarding_step: 'done' });
  const services: Services = {
    ...noMuse,
    async converse() { return { reply: 'I help with trucking work only, so I cannot pick a movie. I can check a rate con or count detention.', on_topic: false, suggest: 'none', load: null }; },
  };
  const out = show(await route(store, text('what movie should I watch'), new Date(), services));
  assert.match(out, /trucking work only/);
  assert.match(out, /\[📄 Check rate con\]/);
});
