import type { LoadStage, RiskCode, StopKind } from '../domain/types.ts';

// Every word the driver sees goes through this table. Buttons must stay short:
// ~20 characters for buttons, ~24 for list rows (see LIMITS in wa/builders.ts).
export interface Strings {
  /** Native name of the language, shown in the language picker. */
  langName: string;

  common: {
    menu: string;
    back: string;
    cancel: string;
    gotIt: string;
    tryAgain: string;
    skip: string;
    more: string;
    duration: (hours: number, minutes: number) => string;
    voiceNote: (seconds: number) => string;
  };

  onboarding: {
    welcome: string;
    chooseLanguage: string;
    chooseLanguageButton: string;
    askName: string;
    askCompany: string;
    askEmail: string;
    disclaimer: string;
    done: (name: string) => string;
    sendRateconButton: string;
  };

  menu: {
    title: string;
    button: string;
    checkRatecon: string;
    checkRateconDesc: string;
    atFacility: string;
    leftFacility: string;
    facilityDesc: string;
    broker: string;
    brokerDesc: string;
    myLoads: string;
    myLoadsDesc: string;
    recovered: string;
    recoveredDesc: string;
    settings: string;
    settingsDesc: string;
  };

  ratecon: {
    reading: string;
    unreadable: (page: number) => string;
    continueWithout: string;
    takePhotoAgain: string;
    route: (from: string, to: string) => string;
    risk: Record<RiskCode, (amount?: string) => string>;
    reputation: (rating: number | undefined, quote: string | undefined, avgWait: string | undefined) => string;
    recommendDetention: (rate: string) => string;
    askChanges: string;
    bookIt: string;
    reject: string;
    openReviews: string;
    reviewsSource: string;
    saved: (loadNumber: string) => string;
  };

  stop: {
    kind: Record<StopKind, string>;
    arrivePrompt: (kind: StopKind) => string;
    arrivedButton: string;
    leftButton: string;
    fixTime: string;
    howLong: string;
    arrived: (time: string, place: string, freeUntil: string, rate: string) => string;
    freeTimeOver: (time: string) => string;
    warnBroker: string;
    running: (duration: string, amount: string) => string;
    leftPrompt: string;
    left: (time: string, onSite: string, billable: string, rate: string, amount: string) => string;
    noDetention: (time: string, onSite: string) => string;
    askBol: string;
    sendBol: string;
    bolMatches: (signedAt: string) => string;
    bolMismatch: (signedAt: string, logged: string) => string;
  };

  email: {
    draftIntro: (to: string) => string;
    translationNote: string;
    send: string;
    copy: string;
    edit: string;
    editPrompt: string;
    sent: (to: string, cc: string) => string;
    copyIntro: string;
    writeToBroker: string;
  };

  reply: {
    received: (summary: string, meaning: string) => string;
    accept: (amount: string) => string;
    counter: string;
    custom: string;
    forwardHint: string;
  };

  loads: {
    title: string;
    button: string;
    empty: string;
    row: (from: string, to: string) => string;
    stage: Record<LoadStage, string>;
    card: (loadNumber: string, route: string, stage: string, detention: string) => string;
  };

  recovered: {
    summary: (month: string, total: string, loads: number) => string;
    nothingYet: string;
  };

  settings: {
    title: string;
    button: string;
    language: string;
    signature: string;
    email: string;
    defaultRate: string;
    voice: string;
    help: string;
    deleteData: string;
    deleteConfirm: string;
    deleteYes: string;
    deleted: string;
  };

  help: {
    text: string;
    example1: string;
    example2: string;
  };

  errors: {
    voiceNotUnderstood: string;
    generic: string;
    typeInstead: string;
  };
}
