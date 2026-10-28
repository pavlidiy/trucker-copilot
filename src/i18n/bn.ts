import type { Strings } from './strings.ts';

export const bn: Strings = {
  langName: 'বাংলা',

  common: {
    menu: '☰ মেনু',
    back: '⬅️ ফিরে যান',
    cancel: 'বাতিল',
    gotIt: '👍 বুঝেছি',
    tryAgain: '🔄 আবার',
    skip: 'বাদ দিন',
    more: '➡️ আরও',
    duration: (h, m) => (h > 0 ? `${h} ঘ ${m} মি` : `${m} মি`),
    voiceNote: (s) => `🎧 ভয়েস মেসেজ 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 নমস্কার! আমি Trucker Copilot। আমি আপনার ভাষায় rate con যাচাই করি, detention গুনি আর broker-কে ইমেইল লিখি।',
    chooseLanguage: 'আপনার ভাষা বেছে নিন',
    chooseLanguageButton: '🌐 ভাষা',
    askName: 'আপনার নাম কী? (broker-কে ইমেইলে এই নাম থাকবে)',
    askCompany: 'আপনার কোম্পানির নাম বা MC নম্বর?',
    askEmail: 'আপনার ইমেইল, যাতে প্রতিটি চিঠির কপি পান। অথবা «বাদ দিন» চাপুন।',
    disclaimer:
      '⚠️ আমি আইনজীবী নই। আমি কাগজ পড়ি আর সময় গুনি, কিন্তু সই বা পাঠানোর আগে সংখ্যাগুলো অবশ্যই মিলিয়ে নিন।',
    done: (name) => `হয়ে গেছে, ${name}! rate con-এর ছবি বা PDF পাঠান, আমি যাচাই করব।`,
    sendRateconButton: '📄 rate con যাচাই',
  },

  menu: {
    title: 'আপনার কী দরকার?',
    button: '☰ মেনু',
    checkRatecon: '📄 rate con যাচাই',
    checkRateconDesc: 'ছবি বা PDF: রেট, জরিমানা, detention',
    atFacility: '📍 আমি গুদামে আছি',
    leftFacility: '🚚 আমি বেরিয়েছি',
    facilityDesc: 'detention-এর জন্য সময় লিখুন',
    broker: '✉️ broker-কে ইমেইল',
    brokerDesc: 'broker-কে লিখুন বা উত্তর অনুবাদ করুন',
    myLoads: '📦 আমার লোড',
    myLoadsDesc: 'অবস্থা, সময়, টাকা',
    recovered: '💰 কত ফেরত পেলাম',
    recoveredDesc: 'detention ও lumper যা আপনাকে দেওয়া হয়েছে',
    settings: '⚙️ সেটিংস ও সাহায্য',
    settingsDesc: 'ভাষা, স্বাক্ষর, ডেটা মুছুন',
  },

  ratecon: {
    askFile: '📄 rate con-এর ছবি বা PDF পাঠান। কয়েক পৃষ্ঠাও চলবে।',
    reading: '👀 কাগজ পড়ছি…',
    unreadable: (p) => `😕 পৃষ্ঠা ${p} পড়তে পারিনি, ছবি ঝাপসা। কাছ থেকে ছবি তুলুন বা PDF পাঠান।`,
    continueWithout: '➡️ এগিয়ে যান',
    takePhotoAgain: '📸 আবার',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *detention-এর শর্ত নেই।* অপেক্ষা করলে broker কিছুই না দিতে পারে।',
      late_fine: (a) => `🔴 *দেরিতে জরিমানা${a ? ` ${a}` : ''}।*`,
      lumper_on_driver: () => '🟡 lumper ড্রাইভার দেবে, রসিদে ফেরত পাবে।',
      low_rpm: () => '🟡 এই রুটে প্রতি মাইল রেট গড়ের চেয়ে কম।',
      tonu_missing: () => '🟡 TONU পেমেন্ট নেই (লোড জায়গায় বাতিল হলে)।',
      good_rate: () => '🟢 রেট গড়ের চেয়ে বেশি।',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ লোডিং গুদাম:',
        rating !== undefined ? `Google-এ ★ ${rating.toFixed(1)},` : undefined,
        quote ? `ড্রাইভাররা লেখেন «${quote}»।` : undefined,
        avgWait ? `আমাদের ড্রাইভাররা সেখানে গড়ে ${avgWait} অপেক্ষা করেছেন।` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `সই করার আগে 2 ঘণ্টার পর ${rate}/ঘণ্টা detention চাইতে বলি।`,
    askChanges: '✉️ পরিবর্তন চান',
    bookIt: '✅ লোড নেব',
    reject: '❌ না',
    openReviews: '⭐ রিভিউ',
    reviewsSource: 'Google Maps-এ গুদামের রিভিউ',
    saved: (n) => `📦 লোড #${n} সেভ হয়েছে। পিকআপ থেকে ডেলিভারি পর্যন্ত সঙ্গে থাকব।`,
  },

  stop: {
    kind: { pickup: 'পিকআপ', delivery: 'ডেলিভারি' },
    arrivePrompt: (k) => `${k === 'pickup' ? 'পিকআপে' : 'ডেলিভারিতে'} পৌঁছে লোকেশন পাঠান।`,
    arrivedButton: '📍 পৌঁছে গেছি',
    leftButton: '🚚 বেরিয়েছি',
    fixTime: '🕒 সময় ঠিক করুন',
    howLong: '⏱ কতক্ষণ হলো',
    arrived: (time, place, freeUntil, rate) =>
      `📍 লেখা হলো: *${time}*-এ পৌঁছেছেন (${place})।\n*${freeUntil}* পর্যন্ত ফ্রি সময়, তারপর ${rate}/ঘণ্টা। মনে করিয়ে দেব।`,
    freeTimeOver: (time) => `⏱ ${time}: 2 ঘণ্টার ফ্রি সময় শেষ, detention চলছে। পরামর্শ: এখনই broker-কে জানান।`,
    warnBroker: '✉️ broker-কে জানান',
    running: (d, a) => `⏱ গুদামে ${d}। এখন পর্যন্ত detention: *${a}*।`,
    leftPrompt: 'বের হওয়ার সময় লোকেশন পাঠান।',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}*-এ বেরিয়েছেন। গুদামে: ${onSite}।\nDetention: ${onSite} − 2 ঘ = *${billable} × ${rate} = ${amount}*\nBOL-এর ছবি পাঠান, সময় মিলিয়ে চিঠি আরও শক্ত করব।`,
    noDetention: (time, onSite) => `✅ *${time}*-এ বেরিয়েছেন। গুদামে: ${onSite}, ফ্রি সময়ের মধ্যে।`,
    askBol: 'সই করা BOL-এর ছবি পাঠান।',
    sendBol: '🧾 BOL পাঠান',
    bolMatches: (signedAt) => `🧾 BOL ${signedAt}-এ সই হয়েছে, আপনার রেকর্ডের সাথে মিলেছে। ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL-এ ${signedAt}, আপনার রেকর্ডে ${logged}। BOL-এর সময় নেব আর দুটোই উল্লেখ করব।`,
  },

  email: {
    draftIntro: (to) => `✉️ ${to}-এর জন্য চিঠি (ইংরেজিতে):`,
    translationNote: '🎧 ভয়েস মেসেজ: চিঠির বাংলা অনুবাদ',
    send: '📤 পাঠান',
    copy: '📋 কপি করুন',
    edit: '✏️ বদলান',
    editPrompt: 'কী বদলাতে হবে বলুন বা লিখুন।',
    sent: (to, cc) => `📤 ${to}-কে পাঠানো হয়েছে। কপি ${cc}-এ আছে। উত্তর এলে অনুবাদ করব।`,
    copyIntro: 'পরের মেসেজটি কপি করতে চেপে ধরে রাখুন:',
    writeToBroker: '✉️ broker-কে ইমেইল',
  },

  reply: {
    received: (summary, meaning) => `💬 broker উত্তর দিয়েছে: «${summary}»\nমানে: ${meaning}`,
    accept: (a) => `✅ হ্যাঁ, ${a}`,
    counter: '💪 পুরোটা চান',
    custom: '✏️ আমার উত্তর',
    forwardHint: 'broker-এর ইমেইল ফরোয়ার্ড করুন বা স্ক্রিনশট পাঠান, অনুবাদ করে দেব।',
  },

  loads: {
    title: 'আপনার শেষ লোডগুলো',
    button: '📦 লোড',
    empty: 'এখনও কোনো লোড নেই। শুরু করতে rate con পাঠান।',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'যাচাই হয়েছে',
      booked: 'নেওয়া হয়েছে',
      at_pickup: 'পিকআপে',
      left_pickup: 'পথে',
      at_delivery: 'ডেলিভারিতে',
      left_delivery: 'ডেলিভারি হয়েছে',
      claim_sent: 'ক্লেম পাঠানো',
      closed: 'বন্ধ',
    },
    card: (n, route, stage, det) => `📦 *লোড #${n}*\n${route}\nঅবস্থা: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ${loads}টি লোডে আপনি *${total}* ফেরত পেয়েছেন।`,
    nothingYet: 'এখনও কিছু ফেরত পাননি। পরের স্টপ লিখুন, আমি প্রতিটি মিনিট গুনব।',
  },

  settings: {
    title: 'সেটিংস',
    button: '⚙️ সেটিংস',
    language: '🌐 ভাষা',
    signature: '✍️ স্বাক্ষর',
    email: '📧 কপির ইমেইল',
    defaultRate: '💵 detention রেট',
    voice: '🎧 ভয়েস উত্তর',
    help: '❓ সাহায্য',
    deleteData: '🗑 আমার ডেটা মুছুন',
    deleteConfirm: 'আপনার সব লোড, কাগজ আর রেকর্ড মুছবেন? এটা ফেরানো যাবে না।',
    deleteYes: '🗑 মুছুন',
    deleted: 'হয়ে গেছে, সব মুছে ফেলা হয়েছে। আবার শুরু করতে যেকোনো সময় লিখুন।',
  },

  help: {
    text:
      'আমি পারি:\n• rate con যাচাই (ছবি বা PDF)\n• পৌঁছানো আর বের হওয়ার সময় লিখে detention গোনা\n• BOL-এর সময় মেলানো\n• broker-কে ইংরেজিতে লেখা আর উত্তর অনুবাদ\n\nআপনার ভাষায় ভয়েস মেসেজ পাঠান।',
    example1: '📄 rate con যাচাই',
    example2: '📍 আমি গুদামে আছি',
  },

  errors: {
    voiceNotUnderstood: '😕 বুঝতে পারিনি। আবার বলুন বা লিখুন।',
    generic: '😕 আমার দিকে কিছু সমস্যা হয়েছে। এক মিনিট পরে চেষ্টা করুন।',
    typeInstead: '⌨️ লিখুন',
  },
};
