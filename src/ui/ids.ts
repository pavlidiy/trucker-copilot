// Ids carried by buttons and list rows. The webhook gets these back in
// interactive.button_reply.id / interactive.list_reply.id and routes on them.

export const ID = {
  menu: 'menu',
  help: 'help',
  settings: 'settings',

  rateconCheck: 'rc.check',
  rateconAskChanges: 'rc.ask_changes',
  rateconBook: 'rc.book',
  rateconReject: 'rc.reject',
  rateconRetry: 'rc.retry',
  rateconContinue: 'rc.continue',

  stopArrive: 'stop.arrive',
  stopLeave: 'stop.leave',
  stopFixTime: 'stop.fix_time',
  stopHowLong: 'stop.how_long',
  stopWarnBroker: 'stop.warn_broker',

  bolSend: 'bol.send',

  emailDraft: 'email.draft',
  emailSend: 'email.send',
  emailCopy: 'email.copy',
  emailEdit: 'email.edit',

  replyAccept: 'reply.accept',
  replyCounter: 'reply.counter',
  replyCustom: 'reply.custom',

  loads: 'loads',
  recovered: 'recovered',

  setLanguage: 'set.language',
  setSignature: 'set.signature',
  setEmail: 'set.email',
  setRate: 'set.rate',
  setVoice: 'set.voice',
  deleteData: 'set.delete',
  deleteConfirm: 'set.delete_yes',

  onboardingSkip: 'onb.skip',
  disclaimerOk: 'onb.disclaimer_ok',
  cancel: 'cancel',
  typeInstead: 'type_instead',
} as const;

export type ActionId = (typeof ID)[keyof typeof ID];

// Parameterised ids: "<prefix>:<value>".
export const langId = (lang: string) => `lang:${lang}`;
export const langPageId = (page: number) => `lang_page:${page}`;
export const loadId = (loadNumber: string) => `load:${loadNumber}`;

export function parseParam(id: string, prefix: 'lang' | 'lang_page' | 'load'): string | undefined {
  return id.startsWith(`${prefix}:`) ? id.slice(prefix.length + 1) : undefined;
}
