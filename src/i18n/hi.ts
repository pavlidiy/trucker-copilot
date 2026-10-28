import type { Strings } from './strings.ts';

export const hi: Strings = {
  langName: 'हिन्दी',

  common: {
    menu: '☰ मेनू',
    back: '⬅️ वापस',
    cancel: 'रद्द करें',
    gotIt: '👍 समझ गया',
    tryAgain: '🔄 फिर से',
    skip: 'छोड़ें',
    more: '➡️ और',
    duration: (h, m) => (h > 0 ? `${h} घं ${m} मि` : `${m} मि`),
    voiceNote: (s) => `🎧 वॉइस मैसेज 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 नमस्ते! मैं Trucker Copilot हूँ। मैं आपकी भाषा में rate con जाँचता हूँ, detention गिनता हूँ और broker को ईमेल लिखता हूँ।',
    chooseLanguage: 'अपनी भाषा चुनें',
    chooseLanguageButton: '🌐 भाषा',
    askName: 'आपका नाम क्या है? (broker को ईमेल में यही नाम होगा)',
    askCompany: 'आपकी कंपनी का नाम या MC नंबर?',
    askEmail: 'आपका ईमेल, ताकि हर चिट्ठी की कॉपी आपको मिले। या «छोड़ें» दबाएँ।',
    disclaimer:
      '⚠️ मैं वकील नहीं हूँ। मैं दस्तावेज़ पढ़ता हूँ और समय गिनता हूँ, पर साइन या भेजने से पहले आँकड़े ज़रूर जाँचें।',
    done: (name) => `हो गया, ${name}! rate con की फ़ोटो या PDF भेजें, मैं जाँच दूँगा।`,
    sendRateconButton: '📄 rate con जाँचें',
  },

  menu: {
    title: 'आपको क्या चाहिए?',
    button: '☰ मेनू',
    checkRatecon: '📄 rate con जाँचें',
    checkRateconDesc: 'फ़ोटो या PDF: रेट, जुर्माना, detention',
    atFacility: '📍 मैं गोदाम पर हूँ',
    leftFacility: '🚚 मैं निकल गया',
    facilityDesc: 'detention के लिए समय दर्ज करें',
    broker: '✉️ broker को ईमेल',
    brokerDesc: 'broker को लिखें या जवाब का अनुवाद',
    myLoads: '📦 मेरे लोड',
    myLoadsDesc: 'स्थिति, समय, पैसा',
    recovered: '💰 कितना वापस मिला',
    recoveredDesc: 'detention और lumper जो आपको मिले',
    settings: '⚙️ सेटिंग और मदद',
    settingsDesc: 'भाषा, हस्ताक्षर, डेटा हटाएँ',
  },

  ratecon: {
    askFile: '📄 rate con की फ़ोटो या PDF भेजें। कई पेज भी चलेंगे।',
    reading: '👀 दस्तावेज़ पढ़ रहा हूँ…',
    unreadable: (p) => `😕 पेज ${p} नहीं पढ़ पाया, फ़ोटो धुँधली है। पास से फ़ोटो लें या PDF भेजें।`,
    continueWithout: '➡️ आगे बढ़ें',
    takePhotoAgain: '📸 फिर से',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *detention की शर्त नहीं है।* अगर इंतज़ार करना पड़ा तो broker कुछ नहीं दे सकता।',
      late_fine: (a) => `🔴 *देरी पर जुर्माना${a ? ` ${a}` : ''}।*`,
      lumper_on_driver: () => '🟡 lumper ड्राइवर देगा, रसीद पर वापस मिलेगा।',
      low_rpm: () => '🟡 इस रूट पर प्रति मील रेट औसत से कम है।',
      tonu_missing: () => '🟡 TONU भुगतान नहीं है (अगर लोड मौके पर रद्द हो)।',
      good_rate: () => '🟢 रेट औसत से ऊपर है।',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ लोडिंग गोदाम:',
        rating !== undefined ? `Google पर ★ ${rating.toFixed(1)},` : undefined,
        quote ? `ड्राइवर लिखते हैं «${quote}»।` : undefined,
        avgWait ? `हमारे ड्राइवर वहाँ औसतन ${avgWait} रुके।` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `साइन करने से पहले 2 घंटे बाद ${rate}/घंटा detention माँगने की सलाह है।`,
    askChanges: '✉️ बदलाव माँगें',
    bookIt: '✅ लोड लूँगा',
    reject: '❌ मना करें',
    openReviews: '⭐ रिव्यू',
    reviewsSource: 'Google Maps पर गोदाम के रिव्यू',
    saved: (n) => `📦 लोड #${n} सेव हो गया। पिकअप से डिलीवरी तक साथ रहूँगा।`,
  },

  stop: {
    kind: { pickup: 'पिकअप', delivery: 'डिलीवरी' },
    arrivePrompt: (k) => `${k === 'pickup' ? 'पिकअप' : 'डिलीवरी'} पर पहुँचते ही लोकेशन भेजें।`,
    arrivedButton: '📍 मैं पहुँच गया',
    leftButton: '🚚 मैं निकल गया',
    fixTime: '🕒 समय बदलें',
    howLong: '⏱ कितनी देर हुई',
    arrived: (time, place, freeUntil, rate) =>
      `📍 दर्ज किया: *${time}* पर पहुँचे (${place})।\n*${freeUntil}* तक फ़्री समय, फिर ${rate}/घंटा। मैं याद दिलाऊँगा।`,
    freeTimeOver: (time) => `⏱ ${time}: 2 घंटे का फ़्री समय खत्म, detention चालू है। सलाह: अभी broker को बता दें।`,
    warnBroker: '✉️ broker को बताएँ',
    running: (d, a) => `⏱ गोदाम पर ${d}। अब तक detention: *${a}*।`,
    leftPrompt: 'निकलते समय लोकेशन भेजें।',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}* पर निकले। गोदाम पर: ${onSite}।\nDetention: ${onSite} − 2 घं = *${billable} × ${rate} = ${amount}*\nBOL की फ़ोटो भेजें, मैं समय मिलाऊँगा और चिट्ठी मज़बूत होगी।`,
    noDetention: (time, onSite) => `✅ *${time}* पर निकले। गोदाम पर: ${onSite}, फ़्री समय के अंदर।`,
    askBol: 'साइन किए हुए BOL की फ़ोटो भेजें।',
    sendBol: '🧾 BOL भेजें',
    bolMatches: (signedAt) => `🧾 BOL ${signedAt} पर साइन हुआ, आपके रिकॉर्ड से मेल खाता है। ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL में ${signedAt} है, आपके रिकॉर्ड में ${logged}। मैं BOL का समय लूँगा और दोनों लिखूँगा।`,
  },

  email: {
    draftIntro: (to) => `✉️ ${to} के लिए चिट्ठी (अंग्रेज़ी में):`,
    translationNote: '🎧 वॉइस मैसेज: चिट्ठी का हिन्दी अनुवाद',
    send: '📤 भेजें',
    copy: '📋 कॉपी करें',
    edit: '✏️ बदलें',
    editPrompt: 'बोलें या लिखें क्या बदलना है।',
    sent: (to, cc) => `📤 ${to} को भेज दिया। कॉपी ${cc} पर है। जवाब आते ही अनुवाद करूँगा।`,
    copyIntro: 'अगला मैसेज कॉपी करने के लिए उसे दबाकर रखें:',
    writeToBroker: '✉️ broker को ईमेल',
  },

  reply: {
    received: (summary, meaning) => `💬 broker ने जवाब दिया: «${summary}»\nमतलब: ${meaning}`,
    accept: (a) => `✅ हाँ, ${a}`,
    counter: '💪 पूरा माँगें',
    custom: '✏️ मेरा जवाब',
    forwardHint: 'broker का ईमेल फ़ॉरवर्ड करें या स्क्रीनशॉट भेजें, मैं अनुवाद करूँगा।',
  },

  loads: {
    title: 'आपके पिछले लोड',
    button: '📦 लोड',
    empty: 'अभी कोई लोड नहीं। शुरू करने के लिए rate con भेजें।',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'जाँचा',
      booked: 'लिया',
      at_pickup: 'पिकअप पर',
      left_pickup: 'रास्ते में',
      at_delivery: 'डिलीवरी पर',
      left_delivery: 'डिलीवर हुआ',
      claim_sent: 'क्लेम भेजा',
      closed: 'बंद',
    },
    card: (n, route, stage, det) => `📦 *लोड #${n}*\n${route}\nस्थिति: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ${loads} लोड पर आपको *${total}* वापस मिले।`,
    nothingYet: 'अभी कुछ वापस नहीं मिला। अगला स्टॉप दर्ज करें, मैं हर मिनट गिनूँगा।',
  },

  settings: {
    title: 'सेटिंग',
    button: '⚙️ सेटिंग',
    language: '🌐 भाषा',
    signature: '✍️ हस्ताक्षर',
    email: '📧 कॉपी के लिए ईमेल',
    defaultRate: '💵 detention रेट',
    voice: '🎧 वॉइस जवाब',
    help: '❓ मदद',
    deleteData: '🗑 मेरा डेटा हटाएँ',
    deleteConfirm: 'आपके सारे लोड, दस्तावेज़ और रिकॉर्ड हटाएँ? यह वापस नहीं होगा।',
    deleteYes: '🗑 हटाएँ',
    deleted: 'हो गया, सब हटा दिया। फिर शुरू करने के लिए कभी भी लिखें।',
  },

  help: {
    text:
      'मैं कर सकता हूँ:\n• rate con जाँचना (फ़ोटो या PDF)\n• पहुँचने और निकलने का समय दर्ज करके detention गिनना\n• BOL का समय मिलाना\n• broker को अंग्रेज़ी में लिखना और जवाब का अनुवाद\n\nअपनी भाषा में वॉइस मैसेज भेजें।',
    example1: '📄 rate con जाँचें',
    example2: '📍 मैं गोदाम पर हूँ',
  },

  errors: {
    voiceNotUnderstood: '😕 समझ नहीं आया। फिर से बोलें या लिखें।',
    generic: '😕 मेरी तरफ़ कुछ गड़बड़ हुई। एक मिनट बाद कोशिश करें।',
    typeInstead: '⌨️ लिखें',
  },
};
