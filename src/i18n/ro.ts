import type { Strings } from './strings.ts';

export const ro: Strings = {
  langName: 'Română',

  common: {
    menu: '☰ Meniu',
    back: '⬅️ Înapoi',
    cancel: 'Anulează',
    gotIt: '👍 Am înțeles',
    tryAgain: '🔄 Încă o dată',
    skip: 'Sari peste',
    more: '➡️ Mai mult',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 mesaj vocal 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Bună ziua! Sunt Trucker Copilot. Verific rate con-uri, calculez detention și scriu brokerilor în locul dumneavoastră, în limba dumneavoastră.',
    chooseLanguage: 'Alegeți limba',
    chooseLanguageButton: '🌐 Limba',
    askName: 'Cum vă numiți? (așa vor fi semnate emailurile către broker)',
    askCompany: 'Numele firmei sau numărul MC?',
    askEmail: 'Emailul dumneavoastră, ca să primiți copia fiecărei scrisori. Sau apăsați «Sari peste».',
    disclaimer:
      '⚠️ Nu sunt avocat. Citesc documente și calculez timpul, dar verificați mereu cifrele înainte să semnați sau să trimiteți.',
    done: (name) => `Gata, ${name}! Trimiteți o poză sau PDF cu rate con-ul și îl verific.`,
    sendRateconButton: '📄 Verifică rate con',
  },

  menu: {
    title: 'De ce aveți nevoie?',
    button: '☰ Meniu',
    checkRatecon: '📄 Verifică rate con',
    checkRateconDesc: 'Poză sau PDF: tarif, amenzi, detention',
    atFacility: '📍 Sunt la depozit',
    leftFacility: '🚚 Am plecat',
    facilityDesc: 'Notează ora pentru detention',
    broker: '✉️ Email la broker',
    brokerDesc: 'Scrie brokerului sau traduce răspunsul',
    myLoads: '📦 Încărcăturile mele',
    myLoadsDesc: 'Stare, timp, bani',
    recovered: '💰 Cât am recuperat',
    recoveredDesc: 'Detention și lumper care v-au fost plătite',
    settings: '⚙️ Setări și ajutor',
    settingsDesc: 'Limbă, semnătură, șterge datele',
  },

  ratecon: {
    reading: '👀 Citesc documentul…',
    unreadable: (p) => `😕 Nu am putut citi pagina ${p}, poza e neclară. Fotografiați mai de aproape sau trimiteți PDF.`,
    continueWithout: '➡️ Continuă',
    takePhotoAgain: '📸 Încă o dată',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Nu există clauză de detention.* Dacă așteptați, brokerul poate să nu plătească nimic.',
      late_fine: (a) => `🔴 *Amendă${a ? ` de ${a}` : ''} pentru întârziere.*`,
      lumper_on_driver: () => '🟡 Șoferul plătește lumperul, rambursare pe bon.',
      low_rpm: () => '🟡 Tariful pe milă e sub medie pe această rută.',
      tonu_missing: () => '🟡 Nu există plată TONU (dacă încărcătura e anulată la fața locului).',
      good_rate: () => '🟢 Tariful e peste medie.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Depozitul de încărcare:',
        rating !== undefined ? `★ ${rating.toFixed(1)} pe Google,` : undefined,
        quote ? `șoferii scriu «${quote}».` : undefined,
        avgWait ? `Șoferii noștri au așteptat acolo în medie ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Vă recomand să cereți detention de ${rate}/h după 2 ore, înainte de semnare.`,
    askChanges: '✉️ Cere modificări',
    bookIt: '✅ Iau cursa',
    reject: '❌ Refuz',
    openReviews: '⭐ Recenzii',
    reviewsSource: 'Recenziile depozitului pe Google Maps',
    saved: (n) => `📦 Încărcătura #${n} salvată. Vă însoțesc de la încărcare la descărcare.`,
  },

  stop: {
    kind: { pickup: 'încărcare', delivery: 'descărcare' },
    arrivePrompt: (k) => `Când ajungeți la ${k === 'pickup' ? 'încărcare' : 'descărcare'}, trimiteți locația.`,
    arrivedButton: '📍 Am ajuns',
    leftButton: '🚚 Am plecat',
    fixTime: '🕒 Corectează ora',
    howLong: '⏱ Cât am stat',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Notat: ați ajuns la *${time}* (${place}).\nTimp gratuit până la *${freeUntil}*, apoi ${rate}/h. Vă anunț.`,
    freeTimeOver: (time) => `⏱ ${time}: cele 2 ore gratuite s-au terminat, curge detention. Sfat: anunțați brokerul acum.`,
    warnBroker: '✉️ Anunță brokerul',
    running: (d, a) => `⏱ La depozit de ${d}. Detention până acum: *${a}*.`,
    leftPrompt: 'Trimiteți locația când plecați.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Ați plecat la *${time}*. La depozit: ${onSite}.\nDetention: ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nTrimiteți poza BOL, verific orele și scrisoarea va fi mai puternică.`,
    noDetention: (time, onSite) => `✅ Ați plecat la *${time}*. La depozit: ${onSite}, în timpul gratuit.`,
    askBol: 'Trimiteți o poză cu BOL-ul semnat.',
    sendBol: '🧾 Trimite BOL',
    bolMatches: (signedAt) => `🧾 BOL semnat la ${signedAt}, se potrivește cu notarea dumneavoastră. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 În BOL scrie ${signedAt}, la dumneavoastră ${logged}. Folosesc ora din BOL și le menționez pe amândouă.`,
  },

  email: {
    draftIntro: (to) => `✉️ Scrisoare pentru ${to} (în engleză):`,
    translationNote: '🎧 mesaj vocal: ce spune scrisoarea, în română',
    send: '📤 Trimite',
    copy: '📋 Copiază',
    edit: '✏️ Modifică',
    editPrompt: 'Spuneți sau scrieți ce să schimb.',
    sent: (to, cc) => `📤 Trimis la ${to}. Copia e în ${cc}. Traduc răspunsul când vine.`,
    copyIntro: 'Țineți apăsat mesajul următor ca să-l copiați:',
    writeToBroker: '✉️ Email la broker',
  },

  reply: {
    received: (summary, meaning) => `💬 Brokerul a răspuns: «${summary}»\nÎnseamnă: ${meaning}`,
    accept: (a) => `✅ Da, ${a}`,
    counter: '💪 Cere tot',
    custom: '✏️ Răspunsul meu',
    forwardHint: 'Redirecționați emailul brokerului sau trimiteți o captură, îl traduc.',
  },

  loads: {
    title: 'Ultimele încărcături',
    button: '📦 Încărcături',
    empty: 'Încă nu aveți încărcături. Trimiteți un rate con ca să începem.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'verificată',
      booked: 'luată',
      at_pickup: 'la încărcare',
      left_pickup: 'pe drum',
      at_delivery: 'la descărcare',
      left_delivery: 'livrată',
      claim_sent: 'cerere trimisă',
      closed: 'închisă',
    },
    card: (n, route, stage, det) => `📦 *Încărcătura #${n}*\n${route}\nStare: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ați recuperat *${total}* din ${loads} încărcături.`,
    nothingYet: 'Încă nimic recuperat. Notați următoarea oprire și voi număra fiecare minut.',
  },

  settings: {
    title: 'Setări',
    button: '⚙️ Setări',
    language: '🌐 Limba',
    signature: '✍️ Semnătura',
    email: '📧 Email pentru copii',
    defaultRate: '💵 Tarif detention',
    voice: '🎧 Răspunsuri vocale',
    help: '❓ Ajutor',
    deleteData: '🗑 Șterge datele mele',
    deleteConfirm: 'Ștergem toate încărcăturile, documentele și notările? Nu se poate anula.',
    deleteYes: '🗑 Șterge',
    deleted: 'Gata, totul a fost șters. Scrieți oricând ca să începem din nou.',
  },

  help: {
    text:
      'Pot să:\n• verific un rate con (poză sau PDF)\n• notez sosirea și plecarea și calculez detention\n• verific orele din BOL\n• scriu brokerului în engleză și traduc răspunsul\n\nVorbiți-mi prin mesaj vocal în limba dumneavoastră.',
    example1: '📄 Verifică rate con',
    example2: '📍 Sunt la depozit',
  },

  errors: {
    voiceNotUnderstood: '😕 Nu am înțeles. Mai spuneți o dată sau scrieți.',
    generic: '😕 Ceva nu a mers la mine. Încercați peste un minut.',
    typeInstead: '⌨️ Scrie',
  },
};
