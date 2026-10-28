import type { Strings } from './strings.ts';

export const ht: Strings = {
  langName: 'Kreyòl ayisyen',

  common: {
    menu: '☰ Meni',
    back: '⬅️ Retounen',
    cancel: 'Anile',
    gotIt: '👍 Mwen konprann',
    tryAgain: '🔄 Ankò',
    skip: 'Sote',
    more: '➡️ Plis',
    duration: (h, m) => (h > 0 ? `${h} è ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 mesaj vokal 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Bonjou! Mwen se Trucker Copilot. Mwen tcheke rate con, mwen konte detention epi mwen ekri broker pou ou, nan lang ou.',
    chooseLanguage: 'Chwazi lang ou',
    chooseLanguageButton: '🌐 Lang',
    askName: 'Ki jan ou rele? (se konsa imèl pou broker yo ap siyen)',
    askCompany: 'Non konpayi ou oswa nimewo MC ou?',
    askEmail: 'Imèl ou, pou ou resevwa kopi chak lèt. Oswa peze «Sote».',
    disclaimer:
      '⚠️ Mwen pa avoka. Mwen li dokiman epi konte tan, men toujou verifye chif yo anvan ou siyen oswa voye.',
    done: (name) => `Li fini, ${name}! Voye foto oswa PDF rate con an, m ap tcheke l.`,
    sendRateconButton: '📄 Tcheke rate con',
  },

  menu: {
    title: 'Kisa ou bezwen?',
    button: '☰ Meni',
    checkRatecon: '📄 Tcheke rate con',
    checkRateconDesc: 'Foto oswa PDF: pri, amann, detention',
    atFacility: '📍 Mwen nan depo a',
    leftFacility: '🚚 Mwen soti',
    facilityDesc: 'Make lè pou detention',
    broker: '✉️ Imèl pou broker',
    brokerDesc: 'Ekri broker oswa tradui repons li',
    myLoads: '📦 Chaj mwen yo',
    myLoadsDesc: 'Estati, tan, lajan',
    recovered: '💰 Konbyen m rekipere',
    recoveredDesc: 'Detention ak lumper yo te peye w',
    settings: '⚙️ Paramèt ak èd',
    settingsDesc: 'Lang, siyati, efase done',
  },

  ratecon: {
    askFile: '📄 Voye foto oswa PDF rate con an. Plizyè paj pa gen pwoblèm.',
    reading: '👀 M ap li dokiman an…',
    unreadable: (p) => `😕 Mwen pa ka li paj ${p}, foto a twoub. Pran l pi pre oswa voye PDF la.`,
    continueWithout: '➡️ Kontinye',
    takePhotoAgain: '📸 Ankò',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Pa gen kloz detention.* Si ou tann, broker a ka pa peye anyen.',
      late_fine: (a) => `🔴 *Amann${a ? ` ${a}` : ''} pou reta.*`,
      lumper_on_driver: () => '🟡 Chofè a peye lumper, ranbousman ak resi.',
      low_rpm: () => '🟡 Pri pa mil la pi ba pase mwayèn sou wout sa a.',
      tonu_missing: () => '🟡 Pa gen peman TONU (si yo anile chaj la sou plas).',
      good_rate: () => '🟢 Pri a pi wo pase mwayèn.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Depo chajman:',
        rating !== undefined ? `★ ${rating.toFixed(1)} sou Google,` : undefined,
        quote ? `chofè yo ekri «${quote}».` : undefined,
        avgWait ? `Chofè nou yo te tann la an mwayèn ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Mwen konseye w mande detention ${rate}/è apre 2 èdtan anvan ou siyen.`,
    askChanges: '✉️ Mande chanjman',
    bookIt: '✅ M pran chaj la',
    reject: '❌ Refize',
    openReviews: '⭐ Revizyon',
    reviewsSource: 'Revizyon depo a sou Google Maps',
    saved: (n) => `📦 Chaj #${n} anrejistre. M ap gide w depi chajman rive livrezon.`,
  },

  stop: {
    kind: { pickup: 'chajman', delivery: 'livrezon' },
    arrivePrompt: (k) => `Lè ou rive nan ${k === 'pickup' ? 'chajman' : 'livrezon'} an, voye pozisyon ou.`,
    arrivedButton: '📍 Mwen rive',
    leftButton: '🚚 Mwen soti',
    fixTime: '🕒 Korije lè a',
    howLong: '⏱ Konbyen tan',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Anrejistre: ou rive a *${time}* (${place}).\nTan gratis jiska *${freeUntil}*, apre sa ${rate}/è. M ap fè w sonje.`,
    freeTimeOver: (time) => `⏱ ${time}: 2 èdtan gratis yo fini, detention ap kouri. Konsèy: avèti broker a kounye a.`,
    warnBroker: '✉️ Avèti broker',
    running: (d, a) => `⏱ Nan depo a depi ${d}. Detention jiskaprezan: *${a}*.`,
    leftPrompt: 'Voye pozisyon ou lè w ap soti.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Ou soti a *${time}*. Nan depo a: ${onSite}.\nDetention: ${onSite} − 2 è = *${billable} × ${rate} = ${amount}*\nVoye foto BOL la, m ap tcheke lè yo epi lèt la ap pi fò.`,
    noDetention: (time, onSite) => `✅ Ou soti a *${time}*. Nan depo a: ${onSite}, nan tan gratis la.`,
    askBol: 'Voye foto BOL ki siyen an.',
    sendBol: '🧾 Voye BOL',
    bolMatches: (signedAt) => `🧾 BOL siyen a ${signedAt}, li matche ak sa ou make. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL la di ${signedAt}, ou te make ${logged}. M ap itilize lè BOL la epi mansyone tou de.`,
  },

  email: {
    draftIntro: (to) => `✉️ Lèt pou ${to} (an anglè):`,
    translationNote: '🎧 mesaj vokal: sa lèt la di, an kreyòl',
    send: '📤 Voye',
    copy: '📋 Kopye',
    edit: '✏️ Chanje',
    editPrompt: 'Di oswa ekri kisa pou m chanje.',
    sent: (to, cc) => `📤 Voye bay ${to}. Kopi a nan ${cc}. M ap tradui repons lan lè l rive.`,
    copyIntro: 'Peze epi kenbe mesaj kap vini an pou kopye l:',
    writeToBroker: '✉️ Imèl pou broker',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker a reponn: «${summary}»\nSa vle di: ${meaning}`,
    accept: (a) => `✅ Wi, ${a}`,
    counter: '💪 Mande tout',
    custom: '✏️ Repons pa m',
    forwardHint: 'Transfere imèl broker a oswa voye yon kapti ekran, m ap tradui l.',
  },

  loads: {
    title: 'Dènye chaj ou yo',
    button: '📦 Chaj',
    empty: 'Poko gen chaj. Voye yon rate con pou kòmanse.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'tcheke',
      booked: 'pran',
      at_pickup: 'nan chajman',
      left_pickup: 'sou wout',
      at_delivery: 'nan livrezon',
      left_delivery: 'livre',
      claim_sent: 'reklamasyon voye',
      closed: 'fèmen',
    },
    card: (n, route, stage, det) => `📦 *Chaj #${n}*\n${route}\nEstati: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ou rekipere *${total}* sou ${loads} chaj.`,
    nothingYet: 'Poko rekipere anyen. Make pwochen kanpe a, m ap konte chak minit.',
  },

  settings: {
    title: 'Paramèt',
    button: '⚙️ Paramèt',
    language: '🌐 Lang',
    signature: '✍️ Siyati',
    email: '📧 Imèl pou kopi',
    defaultRate: '💵 Pri detention',
    voice: '🎧 Repons vokal',
    help: '❓ Èd',
    deleteData: '🗑 Efase done m',
    deleteConfirm: 'Efase tout chaj, dokiman ak anrejistreman ou yo? Ou pa ka defèt sa.',
    deleteYes: '🗑 Efase',
    deleted: 'Li fini, tout bagay efase. Ekri nenpòt ki lè pou rekòmanse.',
  },

  help: {
    text:
      'Mwen ka:\n• tcheke yon rate con (foto oswa PDF)\n• make lè ou rive ak lè ou soti epi konte detention\n• tcheke lè ki sou BOL la\n• ekri broker an anglè epi tradui repons li\n\nPale avè m ak mesaj vokal nan lang ou.',
    example1: '📄 Tcheke rate con',
    example2: '📍 Mwen nan depo a',
  },

  errors: {
    voiceNotUnderstood: '😕 Mwen pa tande byen. Repete oswa ekri l.',
    generic: '😕 Gen yon pwoblèm bò kote m. Eseye nan yon minit.',
    typeInstead: '⌨️ Ekri',
  },
};
