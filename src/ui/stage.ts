import type { LoadStage } from '../domain/types.ts';
import type { Strings } from '../i18n/index.ts';
import type { Choice } from '../wa/types.ts';
import { ID } from './ids.ts';

// Menu variant C: under every quiet reply the driver sees at most two buttons for what
// usually comes next at this stage of the load, and "☰ Menu" as the last one.

export function nextActions(stage: LoadStage | undefined, s: Strings): Choice[] {
  switch (stage) {
    case 'checked':
      return [
        { id: ID.rateconAskChanges, title: s.ratecon.askChanges },
        { id: ID.rateconBook, title: s.ratecon.bookIt },
      ];
    case 'booked':
    case 'left_pickup':
      return [{ id: ID.stopArrive, title: s.stop.arrivedButton }];
    case 'at_pickup':
    case 'at_delivery':
      return [
        { id: ID.stopLeave, title: s.stop.leftButton },
        { id: ID.stopHowLong, title: s.stop.howLong },
      ];
    case 'left_delivery':
      return [
        { id: ID.emailDraft, title: s.email.writeToBroker },
        { id: ID.bolSend, title: s.stop.sendBol },
      ];
    case 'claim_sent':
    case 'closed':
    case undefined:
      return [{ id: ID.rateconCheck, title: s.menu.checkRatecon }];
  }
}

export function withMenu(choices: Choice[], s: Strings): Choice[] {
  return [...choices.slice(0, 2), { id: ID.menu, title: s.common.menu }];
}

/** The stop the driver is heading to or standing at, for the "📍 I'm here" and "🚚 I left" labels. */
export function currentStop(stage: LoadStage): 'pickup' | 'delivery' | undefined {
  if (stage === 'booked' || stage === 'at_pickup') return 'pickup';
  if (stage === 'left_pickup' || stage === 'at_delivery') return 'delivery';
  return undefined;
}

export function isOnSite(stage: LoadStage | undefined): boolean {
  return stage === 'at_pickup' || stage === 'at_delivery';
}
