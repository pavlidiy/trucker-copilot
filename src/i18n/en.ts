import type { Strings } from './strings.ts';

export const en: Strings = {
  langName: 'English',

  common: {
    menu: '☰ Menu',
    back: '⬅️ Back',
    cancel: 'Cancel',
    gotIt: '👍 Got it',
    tryAgain: '🔄 Try again',
    skip: 'Skip',
    more: '➡️ More',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 voice note 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      "👋 Hi! I'm Trucker Copilot. I check rate cons, track detention and write to brokers for you, in your language.",
    chooseLanguage: 'Choose your language',
    chooseLanguageButton: '🌐 Language',
    askName: 'What is your name? (as it should appear in emails to brokers)',
    askCompany: 'Your company name or MC number?',
    askEmail: 'Your email, so you get a copy of every letter. Or tap Skip.',
    disclaimer:
      "⚠️ I'm not a lawyer. I read documents and count time, but always check the numbers before you sign or send.",
    done: (name) => `Done, ${name}! Send me a photo or PDF of your rate con and I'll check it.`,
    sendRateconButton: '📄 Check rate con',
  },

  menu: {
    title: 'What do you need?',
    button: '☰ Menu',
    checkRatecon: '📄 Check rate con',
    checkRateconDesc: 'Photo or PDF: rate, fines, detention',
    atFacility: "📍 I'm at the facility",
    leftFacility: '🚚 I left',
    facilityDesc: 'Log time for detention',
    broker: '✉️ Broker email',
    brokerDesc: 'Write to broker or translate a reply',
    myLoads: '📦 My loads',
    myLoadsDesc: 'Status, time, money',
    recovered: '💰 Money recovered',
    recoveredDesc: 'Detention and lumper you got back',
    settings: '⚙️ Settings & help',
    settingsDesc: 'Language, signature, delete data',
  },

  ratecon: {
    reading: '👀 Reading the document…',
    unreadable: (p) => `😕 I couldn't read page ${p}, the photo is blurry. Take it closer or send the PDF.`,
    continueWithout: '➡️ Continue',
    takePhotoAgain: '📸 Again',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => "🔴 *No detention clause.* If you wait, the broker may pay nothing.",
      late_fine: (a) => `🔴 *Late fee${a ? ` ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 Driver pays lumper, reimbursed by receipt.',
      low_rpm: () => '🟡 Rate per mile is below average for this lane.',
      tonu_missing: () => '🟡 No TONU (truck ordered, not used) pay.',
      good_rate: () => '🟢 Rate is above average.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Pickup facility:',
        rating !== undefined ? `★ ${rating.toFixed(1)} on Google,` : undefined,
        quote ? `drivers write "${quote}".` : undefined,
        avgWait ? `Our drivers waited ${avgWait} on average.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `I recommend asking for detention ${rate}/hr after 2 hours before you sign.`,
    askChanges: '✉️ Ask for changes',
    bookIt: '✅ Book it',
    reject: '❌ Pass',
    openReviews: '⭐ Reviews',
    reviewsSource: 'Facility reviews on Google Maps',
    saved: (n) => `📦 Load #${n} saved. I'll guide you from pickup to delivery.`,
  },

  stop: {
    kind: { pickup: 'pickup', delivery: 'delivery' },
    arrivePrompt: (k) => `Send your location when you arrive at ${k === 'pickup' ? 'pickup' : 'delivery'}.`,
    arrivedButton: "📍 I'm here",
    leftButton: '🚚 I left',
    fixTime: '🕒 Fix time',
    howLong: '⏱ How long?',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Logged: arrived at *${time}* (${place}).\nFree time until *${freeUntil}*, then ${rate}/hr. I'll remind you.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: your 2 free hours are over. Detention is running. Tip: tell the broker now so they know.`,
    warnBroker: '✉️ Warn broker',
    running: (d, a) => `⏱ On site ${d}. Detention so far: *${a}*.`,
    leftPrompt: 'Send your location as you leave.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Left at *${time}*. On site: ${onSite}.\nDetention: ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nSend a photo of the BOL, I'll check the times and the letter will be stronger.`,
    noDetention: (time, onSite) => `✅ Left at *${time}*. On site: ${onSite}, within free time. No detention.`,
    askBol: 'Send a photo of the signed BOL.',
    sendBol: '🧾 Send BOL',
    bolMatches: (signedAt) => `🧾 BOL signed at ${signedAt}, matches your log. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL says ${signedAt}, your log says ${logged}. I'll use the BOL time and mention both.`,
  },

  email: {
    draftIntro: (to) => `✉️ Letter to ${to} (in English):`,
    translationNote: '🎧 voice note: what the letter says, in your language',
    send: '📤 Send',
    copy: '📋 Copy',
    edit: '✏️ Edit',
    editPrompt: 'Say or type what to change.',
    sent: (to, cc) => `📤 Sent to ${to}. A copy is in ${cc}. I'll translate the reply when it comes.`,
    copyIntro: 'Press and hold the next message to copy it:',
    writeToBroker: '✉️ Email broker',
  },

  reply: {
    received: (summary, meaning) => `💬 The broker replied: "${summary}"\nMeaning: ${meaning}`,
    accept: (a) => `✅ Accept ${a}`,
    counter: '💪 Ask for full',
    custom: '✏️ My answer',
    forwardHint: 'Forward the broker’s email or send a screenshot, I’ll translate it.',
  },

  loads: {
    title: 'Your last loads',
    button: '📦 Loads',
    empty: 'No loads yet. Send a rate con to start.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'checked',
      booked: 'booked',
      at_pickup: 'at pickup',
      left_pickup: 'in transit',
      at_delivery: 'at delivery',
      left_delivery: 'delivered',
      claim_sent: 'claim sent',
      closed: 'closed',
    },
    card: (n, route, stage, det) => `📦 *Load #${n}*\n${route}\nStatus: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: you got back *${total}* on ${loads} loads.`,
    nothingYet: 'Nothing recovered yet. Log your next stop and I’ll count every minute.',
  },

  settings: {
    title: 'Settings',
    button: '⚙️ Settings',
    language: '🌐 Language',
    signature: '✍️ Signature',
    email: '📧 Email for copies',
    defaultRate: '💵 Default detention',
    voice: '🎧 Voice replies',
    help: '❓ Help',
    deleteData: '🗑 Delete my data',
    deleteConfirm: 'Delete all your loads, documents and logs? This cannot be undone.',
    deleteYes: '🗑 Delete',
    deleted: 'Done. Everything is deleted. Write any time to start again.',
  },

  help: {
    text:
      'I can:\n• check a rate con (photo or PDF)\n• log arrive/leave and count detention\n• check BOL times\n• write to the broker in English and translate the reply\n\nTalk to me by voice in your language.',
    example1: '📄 Check rate con',
    example2: "📍 I'm at the facility",
  },

  errors: {
    voiceNotUnderstood: "😕 I didn't catch that. Say it again or type it.",
    generic: '😕 Something went wrong on my side. Try again in a minute.',
    typeInstead: '⌨️ Type it',
  },
};
