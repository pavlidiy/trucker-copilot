import type { Strings } from './strings.ts';

export const pa: Strings = {
  langName: 'ਪੰਜਾਬੀ',

  common: {
    menu: '☰ ਮੇਨੂ',
    back: '⬅️ ਵਾਪਸ',
    cancel: 'ਰੱਦ ਕਰੋ',
    gotIt: '👍 ਸਮਝ ਗਿਆ',
    tryAgain: '🔄 ਦੁਬਾਰਾ',
    skip: 'ਛੱਡੋ',
    more: '➡️ ਹੋਰ',
    duration: (h, m) => (h > 0 ? `${h} ਘੰ ${m} ਮਿੰ` : `${m} ਮਿੰ`),
    voiceNote: (s) => `🎧 ਵੌਇਸ ਮੈਸੇਜ 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ Trucker Copilot ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ rate con ਚੈੱਕ ਕਰਦਾ ਹਾਂ, detention ਗਿਣਦਾ ਹਾਂ ਅਤੇ broker ਨੂੰ ਈਮੇਲ ਲਿਖਦਾ ਹਾਂ।',
    chooseLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    chooseLanguageButton: '🌐 ਭਾਸ਼ਾ',
    askName: 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ? (broker ਨੂੰ ਈਮੇਲ ਵਿੱਚ ਇਹੀ ਨਾਮ ਹੋਵੇਗਾ)',
    askCompany: 'ਤੁਹਾਡੀ ਕੰਪਨੀ ਦਾ ਨਾਮ ਜਾਂ MC ਨੰਬਰ?',
    askEmail: 'ਤੁਹਾਡੀ ਈਮੇਲ, ਤਾਂ ਜੋ ਹਰ ਚਿੱਠੀ ਦੀ ਕਾਪੀ ਤੁਹਾਨੂੰ ਮਿਲੇ। ਜਾਂ «ਛੱਡੋ» ਦਬਾਓ।',
    disclaimer:
      '⚠️ ਮੈਂ ਵਕੀਲ ਨਹੀਂ ਹਾਂ। ਮੈਂ ਕਾਗਜ਼ ਪੜ੍ਹਦਾ ਹਾਂ ਅਤੇ ਸਮਾਂ ਗਿਣਦਾ ਹਾਂ, ਪਰ ਸਾਈਨ ਜਾਂ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਅੰਕੜੇ ਜ਼ਰੂਰ ਚੈੱਕ ਕਰੋ।',
    done: (name) => `ਹੋ ਗਿਆ, ${name}! rate con ਦੀ ਫੋਟੋ ਜਾਂ PDF ਭੇਜੋ, ਮੈਂ ਚੈੱਕ ਕਰਾਂਗਾ।`,
    sendRateconButton: '📄 rate con ਚੈੱਕ ਕਰੋ',
  },

  menu: {
    title: 'ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?',
    button: '☰ ਮੇਨੂ',
    checkRatecon: '📄 rate con ਚੈੱਕ ਕਰੋ',
    checkRateconDesc: 'ਫੋਟੋ ਜਾਂ PDF: ਰੇਟ, ਜੁਰਮਾਨਾ, detention',
    atFacility: '📍 ਮੈਂ ਗੋਦਾਮ ਤੇ ਹਾਂ',
    leftFacility: '🚚 ਮੈਂ ਨਿਕਲ ਗਿਆ',
    facilityDesc: 'detention ਲਈ ਸਮਾਂ ਦਰਜ ਕਰੋ',
    broker: '✉️ broker ਨੂੰ ਈਮੇਲ',
    brokerDesc: 'broker ਨੂੰ ਲਿਖੋ ਜਾਂ ਜਵਾਬ ਦਾ ਅਨੁਵਾਦ',
    myLoads: '📦 ਮੇਰੇ ਲੋਡ',
    myLoadsDesc: 'ਸਥਿਤੀ, ਸਮਾਂ, ਪੈਸਾ',
    recovered: '💰 ਕਿੰਨਾ ਵਾਪਸ ਮਿਲਿਆ',
    recoveredDesc: 'detention ਅਤੇ lumper ਜੋ ਤੁਹਾਨੂੰ ਮਿਲੇ',
    settings: '⚙️ ਸੈਟਿੰਗ ਅਤੇ ਮਦਦ',
    settingsDesc: 'ਭਾਸ਼ਾ, ਦਸਤਖ਼ਤ, ਡਾਟਾ ਮਿਟਾਓ',
  },

  ratecon: {
    askFile: '📄 rate con ਦੀ ਫੋਟੋ ਜਾਂ PDF ਭੇਜੋ। ਕਈ ਪੰਨੇ ਵੀ ਚੱਲਣਗੇ।',
    reading: '👀 ਕਾਗਜ਼ ਪੜ੍ਹ ਰਿਹਾ ਹਾਂ…',
    unreadable: (p) => `😕 ਪੰਨਾ ${p} ਨਹੀਂ ਪੜ੍ਹ ਸਕਿਆ, ਫੋਟੋ ਧੁੰਦਲੀ ਹੈ। ਨੇੜਿਓਂ ਫੋਟੋ ਲਓ ਜਾਂ PDF ਭੇਜੋ।`,
    continueWithout: '➡️ ਅੱਗੇ ਚੱਲੋ',
    takePhotoAgain: '📸 ਦੁਬਾਰਾ',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *detention ਦੀ ਸ਼ਰਤ ਨਹੀਂ ਹੈ।* ਜੇ ਉਡੀਕ ਕਰਨੀ ਪਈ ਤਾਂ broker ਕੁਝ ਵੀ ਨਹੀਂ ਦੇ ਸਕਦਾ।',
      late_fine: (a) => `🔴 *ਦੇਰੀ ਤੇ ਜੁਰਮਾਨਾ${a ? ` ${a}` : ''}।*`,
      lumper_on_driver: () => '🟡 lumper ਡਰਾਈਵਰ ਦੇਵੇਗਾ, ਰਸੀਦ ਤੇ ਵਾਪਸ ਮਿਲੇਗਾ।',
      low_rpm: () => '🟡 ਇਸ ਰੂਟ ਤੇ ਪ੍ਰਤੀ ਮੀਲ ਰੇਟ ਔਸਤ ਤੋਂ ਘੱਟ ਹੈ।',
      tonu_missing: () => '🟡 TONU ਦੀ ਅਦਾਇਗੀ ਨਹੀਂ (ਜੇ ਲੋਡ ਮੌਕੇ ਤੇ ਰੱਦ ਹੋਵੇ)।',
      good_rate: () => '🟢 ਰੇਟ ਔਸਤ ਤੋਂ ਵੱਧ ਹੈ।',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ ਲੋਡਿੰਗ ਗੋਦਾਮ:',
        rating !== undefined ? `Google ਤੇ ★ ${rating.toFixed(1)},` : undefined,
        quote ? `ਡਰਾਈਵਰ ਲਿਖਦੇ ਹਨ «${quote}»।` : undefined,
        avgWait ? `ਸਾਡੇ ਡਰਾਈਵਰ ਉੱਥੇ ਔਸਤਨ ${avgWait} ਰੁਕੇ।` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `ਸਾਈਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ 2 ਘੰਟੇ ਬਾਅਦ ${rate}/ਘੰਟਾ detention ਮੰਗਣ ਦੀ ਸਲਾਹ ਹੈ।`,
    askChanges: '✉️ ਬਦਲਾਅ ਮੰਗੋ',
    bookIt: '✅ ਲੋਡ ਲਵਾਂਗਾ',
    reject: '❌ ਨਾਂਹ',
    openReviews: '⭐ ਰਿਵਿਊ',
    reviewsSource: 'Google Maps ਤੇ ਗੋਦਾਮ ਦੇ ਰਿਵਿਊ',
    saved: (n) => `📦 ਲੋਡ #${n} ਸੇਵ ਹੋ ਗਿਆ। ਪਿਕਅੱਪ ਤੋਂ ਡਿਲੀਵਰੀ ਤੱਕ ਨਾਲ ਰਹਾਂਗਾ।`,
  },

  stop: {
    kind: { pickup: 'ਪਿਕਅੱਪ', delivery: 'ਡਿਲੀਵਰੀ' },
    arrivePrompt: (k) => `${k === 'pickup' ? 'ਪਿਕਅੱਪ' : 'ਡਿਲੀਵਰੀ'} ਤੇ ਪਹੁੰਚ ਕੇ ਲੋਕੇਸ਼ਨ ਭੇਜੋ।`,
    arrivedButton: '📍 ਮੈਂ ਪਹੁੰਚ ਗਿਆ',
    leftButton: '🚚 ਮੈਂ ਨਿਕਲ ਗਿਆ',
    fixTime: '🕒 ਸਮਾਂ ਬਦਲੋ',
    howLong: '⏱ ਕਿੰਨੀ ਦੇਰ ਹੋਈ',
    arrived: (time, place, freeUntil, rate) =>
      `📍 ਦਰਜ ਕੀਤਾ: *${time}* ਤੇ ਪਹੁੰਚੇ (${place})।\n*${freeUntil}* ਤੱਕ ਮੁਫ਼ਤ ਸਮਾਂ, ਫਿਰ ${rate}/ਘੰਟਾ। ਮੈਂ ਯਾਦ ਕਰਾਵਾਂਗਾ।`,
    freeTimeOver: (time) => `⏱ ${time}: 2 ਘੰਟੇ ਦਾ ਮੁਫ਼ਤ ਸਮਾਂ ਖ਼ਤਮ, detention ਚੱਲ ਰਿਹਾ ਹੈ। ਸਲਾਹ: ਹੁਣੇ broker ਨੂੰ ਦੱਸੋ।`,
    warnBroker: '✉️ broker ਨੂੰ ਦੱਸੋ',
    running: (d, a) => `⏱ ਗੋਦਾਮ ਤੇ ${d}। ਹੁਣ ਤੱਕ detention: *${a}*।`,
    leftPrompt: 'ਨਿਕਲਦੇ ਸਮੇਂ ਲੋਕੇਸ਼ਨ ਭੇਜੋ।',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}* ਤੇ ਨਿਕਲੇ। ਗੋਦਾਮ ਤੇ: ${onSite}।\nDetention: ${onSite} − 2 ਘੰ = *${billable} × ${rate} = ${amount}*\nBOL ਦੀ ਫੋਟੋ ਭੇਜੋ, ਮੈਂ ਸਮਾਂ ਮਿਲਾਵਾਂਗਾ ਅਤੇ ਚਿੱਠੀ ਮਜ਼ਬੂਤ ਹੋਵੇਗੀ।`,
    noDetention: (time, onSite) => `✅ *${time}* ਤੇ ਨਿਕਲੇ। ਗੋਦਾਮ ਤੇ: ${onSite}, ਮੁਫ਼ਤ ਸਮੇਂ ਦੇ ਅੰਦਰ।`,
    askBol: 'ਸਾਈਨ ਕੀਤੇ BOL ਦੀ ਫੋਟੋ ਭੇਜੋ।',
    sendBol: '🧾 BOL ਭੇਜੋ',
    bolMatches: (signedAt) => `🧾 BOL ${signedAt} ਤੇ ਸਾਈਨ ਹੋਇਆ, ਤੁਹਾਡੇ ਰਿਕਾਰਡ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL ਵਿੱਚ ${signedAt} ਹੈ, ਤੁਹਾਡੇ ਰਿਕਾਰਡ ਵਿੱਚ ${logged}। ਮੈਂ BOL ਦਾ ਸਮਾਂ ਲਵਾਂਗਾ ਅਤੇ ਦੋਵੇਂ ਲਿਖਾਂਗਾ।`,
  },

  email: {
    draftIntro: (to) => `✉️ ${to} ਲਈ ਚਿੱਠੀ (ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ):`,
    translationNote: '🎧 ਵੌਇਸ ਮੈਸੇਜ: ਚਿੱਠੀ ਦਾ ਪੰਜਾਬੀ ਅਨੁਵਾਦ',
    send: '📤 ਭੇਜੋ',
    copy: '📋 ਕਾਪੀ ਕਰੋ',
    edit: '✏️ ਬਦਲੋ',
    editPrompt: 'ਬੋਲੋ ਜਾਂ ਲਿਖੋ ਕੀ ਬਦਲਣਾ ਹੈ।',
    sent: (to, cc) => `📤 ${to} ਨੂੰ ਭੇਜ ਦਿੱਤੀ। ਕਾਪੀ ${cc} ਤੇ ਹੈ। ਜਵਾਬ ਆਉਂਦੇ ਹੀ ਅਨੁਵਾਦ ਕਰਾਂਗਾ।`,
    copyIntro: 'ਅਗਲਾ ਮੈਸੇਜ ਕਾਪੀ ਕਰਨ ਲਈ ਉਸਨੂੰ ਦਬਾ ਕੇ ਰੱਖੋ:',
    writeToBroker: '✉️ broker ਨੂੰ ਈਮੇਲ',
  },

  reply: {
    received: (summary, meaning) => `💬 broker ਨੇ ਜਵਾਬ ਦਿੱਤਾ: «${summary}»\nਮਤਲਬ: ${meaning}`,
    accept: (a) => `✅ ਹਾਂ, ${a}`,
    counter: '💪 ਪੂਰਾ ਮੰਗੋ',
    custom: '✏️ ਮੇਰਾ ਜਵਾਬ',
    forwardHint: 'broker ਦੀ ਈਮੇਲ ਫਾਰਵਰਡ ਕਰੋ ਜਾਂ ਸਕ੍ਰੀਨਸ਼ਾਟ ਭੇਜੋ, ਮੈਂ ਅਨੁਵਾਦ ਕਰਾਂਗਾ।',
  },

  loads: {
    title: 'ਤੁਹਾਡੇ ਪਿਛਲੇ ਲੋਡ',
    button: '📦 ਲੋਡ',
    empty: 'ਅਜੇ ਕੋਈ ਲੋਡ ਨਹੀਂ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ rate con ਭੇਜੋ।',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'ਚੈੱਕ ਹੋਇਆ',
      booked: 'ਲਿਆ',
      at_pickup: 'ਪਿਕਅੱਪ ਤੇ',
      left_pickup: 'ਰਸਤੇ ਵਿੱਚ',
      at_delivery: 'ਡਿਲੀਵਰੀ ਤੇ',
      left_delivery: 'ਡਿਲੀਵਰ ਹੋਇਆ',
      claim_sent: 'ਕਲੇਮ ਭੇਜਿਆ',
      closed: 'ਬੰਦ',
    },
    card: (n, route, stage, det) => `📦 *ਲੋਡ #${n}*\n${route}\nਸਥਿਤੀ: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ${loads} ਲੋਡਾਂ ਤੇ ਤੁਹਾਨੂੰ *${total}* ਵਾਪਸ ਮਿਲੇ।`,
    nothingYet: 'ਅਜੇ ਕੁਝ ਵਾਪਸ ਨਹੀਂ ਮਿਲਿਆ। ਅਗਲਾ ਸਟਾਪ ਦਰਜ ਕਰੋ, ਮੈਂ ਹਰ ਮਿੰਟ ਗਿਣਾਂਗਾ।',
  },

  settings: {
    title: 'ਸੈਟਿੰਗ',
    button: '⚙️ ਸੈਟਿੰਗ',
    language: '🌐 ਭਾਸ਼ਾ',
    signature: '✍️ ਦਸਤਖ਼ਤ',
    email: '📧 ਕਾਪੀ ਲਈ ਈਮੇਲ',
    defaultRate: '💵 detention ਰੇਟ',
    voice: '🎧 ਵੌਇਸ ਜਵਾਬ',
    help: '❓ ਮਦਦ',
    deleteData: '🗑 ਮੇਰਾ ਡਾਟਾ ਮਿਟਾਓ',
    deleteConfirm: 'ਤੁਹਾਡੇ ਸਾਰੇ ਲੋਡ, ਕਾਗਜ਼ ਅਤੇ ਰਿਕਾਰਡ ਮਿਟਾਈਏ? ਇਹ ਵਾਪਸ ਨਹੀਂ ਹੋਵੇਗਾ।',
    deleteYes: '🗑 ਮਿਟਾਓ',
    deleted: 'ਹੋ ਗਿਆ, ਸਭ ਮਿਟਾ ਦਿੱਤਾ। ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਦੇ ਵੀ ਲਿਖੋ।',
  },

  help: {
    text:
      'ਮੈਂ ਕਰ ਸਕਦਾ ਹਾਂ:\n• rate con ਚੈੱਕ (ਫੋਟੋ ਜਾਂ PDF)\n• ਪਹੁੰਚਣ ਅਤੇ ਨਿਕਲਣ ਦਾ ਸਮਾਂ ਦਰਜ ਕਰਕੇ detention ਗਿਣਨਾ\n• BOL ਦਾ ਸਮਾਂ ਮਿਲਾਉਣਾ\n• broker ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਲਿਖਣਾ ਅਤੇ ਜਵਾਬ ਦਾ ਅਨੁਵਾਦ\n\nਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਵੌਇਸ ਮੈਸੇਜ ਭੇਜੋ।',
    example1: '📄 rate con ਚੈੱਕ ਕਰੋ',
    example2: '📍 ਮੈਂ ਗੋਦਾਮ ਤੇ ਹਾਂ',
  },

  errors: {
    voiceNotUnderstood: '😕 ਸਮਝ ਨਹੀਂ ਆਇਆ। ਦੁਬਾਰਾ ਬੋਲੋ ਜਾਂ ਲਿਖੋ।',
    generic: '😕 ਮੇਰੇ ਵੱਲੋਂ ਕੋਈ ਗੜਬੜ ਹੋਈ। ਇੱਕ ਮਿੰਟ ਬਾਅਦ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    typeInstead: '⌨️ ਲਿਖੋ',
  },
};
