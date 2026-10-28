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
    async readRatecon(media) { assert.equal(media.id, 'media1'); return sample(); },
    async sendNow(msgs) { early.push(show(msgs)); },
  };
  const photo: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'image', image: { id: 'media1', mime_type: 'image/jpeg' } };

  const result = show(await route(store, photo, new Date(), services));
  assert.match(early.join(), /Reading the document/);
  assert.match(result, /#8841207/);
  assert.match(result, /No detention clause/);
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
  const services: Services = { async readRatecon() { return sample({ is_rate_confirmation: false }); }, async sendNow() {} };
  const selfie: InboundMessage = { from, id: `m${++n}`, timestamp: '0', type: 'image', image: { id: 'x', mime_type: 'image/jpeg' } };
  assert.match(show(await route(store, selfie, new Date(), services)), /photo or PDF of the rate con/);
  assert.equal(loads.length, 0);
});
