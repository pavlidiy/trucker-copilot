import type { Strings } from './strings.ts';

export const uz: Strings = {
  langName: 'Oʻzbekcha',

  common: {
    menu: '☰ Menyu',
    back: '⬅️ Orqaga',
    cancel: 'Bekor qilish',
    gotIt: '👍 Tushundim',
    tryAgain: '🔄 Yana',
    skip: 'Oʻtkazib yuborish',
    more: '➡️ Yana',
    duration: (h, m) => (h > 0 ? `${h} soat ${m} daq` : `${m} daq`),
    voiceNote: (s) => `🎧 ovozli xabar 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Assalomu alaykum! Men Trucker Copilot. Rate con’ni tekshiraman, detention’ni hisoblayman va broker’ga siz uchun, oʻz tilingizda xat yozaman.',
    chooseLanguage: 'Tilni tanlang',
    chooseLanguageButton: '🌐 Til',
    askName: 'Ismingiz nima? (broker’ga xatda shunday imzo boʻladi)',
    askCompany: 'Kompaniyangiz nomi yoki MC raqami?',
    askEmail: 'Emailingiz, har bir xat nusxasi sizga kelsin. Yoki «Oʻtkazib yuborish»ni bosing.',
    disclaimer:
      '⚠️ Men yurist emasman. Hujjatlarni oʻqiyman va vaqtni hisoblayman, lekin imzolash yoki yuborishdan oldin raqamlarni doim tekshiring.',
    done: (name) => `Tayyor, ${name}! Rate con rasmini yoki PDF’ini yuboring, tekshiraman.`,
    sendRateconButton: '📄 Rate con tekshir',
  },

  menu: {
    title: 'Nima kerak?',
    button: '☰ Menyu',
    checkRatecon: '📄 Rate con tekshir',
    checkRateconDesc: 'Rasm yoki PDF: narx, jarimalar, detention',
    atFacility: '📍 Men omborda',
    leftFacility: '🚚 Chiqib ketdim',
    facilityDesc: 'Detention uchun vaqtni belgilash',
    broker: '✉️ Broker’ga xat',
    brokerDesc: 'Broker’ga yozish yoki javobni tarjima qilish',
    myLoads: '📦 Yuklarim',
    myLoadsDesc: 'Holat, vaqt, pul',
    recovered: '💰 Qancha qaytardim',
    recoveredDesc: 'Sizga toʻlangan detention va lumper',
    settings: '⚙️ Sozlamalar va yordam',
    settingsDesc: 'Til, imzo, maʼlumotlarni oʻchirish',
  },

  ratecon: {
    reading: '👀 Hujjatni oʻqiyapman…',
    unreadable: (p) => `😕 ${p}-sahifani oʻqiy olmadim, rasm xira. Yaqinroqdan oling yoki PDF yuboring.`,
    continueWithout: '➡️ Davom etish',
    takePhotoAgain: '📸 Qayta olish',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Detention bandi yoʻq.* Kutib qolsangiz, broker hech narsa toʻlamasligi mumkin.',
      late_fine: (a) => `🔴 *Kechikish uchun jarima${a ? ` ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 Lumper’ni haydovchi toʻlaydi, chek boʻyicha qaytariladi.',
      low_rpm: () => '🟡 Bu yoʻnalishda milya narxi oʻrtachadan past.',
      tonu_missing: () => '🟡 TONU toʻlovi yoʻq (yuk joyida bekor qilinsa).',
      good_rate: () => '🟢 Narx oʻrtachadan yuqori.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Yuklash ombori:',
        rating !== undefined ? `Google’da ★ ${rating.toFixed(1)},` : undefined,
        quote ? `haydovchilar «${quote}» deb yozadi.` : undefined,
        avgWait ? `Bizning haydovchilar u yerda oʻrtacha ${avgWait} kutgan.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Imzolashdan oldin 2 soatdan keyin ${rate}/soat detention soʻrashni maslahat beraman.`,
    askChanges: '✉️ Oʻzgartirish',
    bookIt: '✅ Yukni olaman',
    reject: '❌ Rad etish',
    openReviews: '⭐ Sharhlar',
    reviewsSource: 'Google Maps’dagi ombor sharhlari',
    saved: (n) => `📦 #${n} yuk saqlandi. Yuklashdan tushirishgacha yoningizdaman.`,
  },

  stop: {
    kind: { pickup: 'yuklash', delivery: 'tushirish' },
    arrivePrompt: (k) => `${k === 'pickup' ? 'Yuklash' : 'Tushirish'} joyiga yetganda lokatsiyani yuboring.`,
    arrivedButton: '📍 Yetib keldim',
    leftButton: '🚚 Chiqib ketdim',
    fixTime: '🕒 Vaqtni tuzatish',
    howLong: '⏱ Qancha turdim',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Belgilandi: *${time}* da keldingiz (${place}).\nBepul vaqt *${freeUntil}* gacha, keyin ${rate}/soat. Eslataman.`,
    freeTimeOver: (time) => `⏱ ${time}: 2 soatlik bepul vaqt tugadi, detention ketyapti. Maslahat: hozir broker’ga xabar bering.`,
    warnBroker: '✉️ Broker’ga xabar',
    running: (d, a) => `⏱ Omborda ${d}. Hozircha detention: *${a}*.`,
    leftPrompt: 'Chiqayotganda lokatsiyani yuboring.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}* da chiqdingiz. Omborda: ${onSite}.\nDetention: ${onSite} − 2 soat = *${billable} × ${rate} = ${amount}*\nBOL rasmini yuboring, vaqtni solishtiraman va xat kuchliroq boʻladi.`,
    noDetention: (time, onSite) => `✅ *${time}* da chiqdingiz. Omborda: ${onSite}, bepul vaqt ichida.`,
    askBol: 'Imzolangan BOL rasmini yuboring.',
    sendBol: '🧾 BOL yuborish',
    bolMatches: (signedAt) => `🧾 BOL ${signedAt} da imzolangan, belgingizga mos. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL’da ${signedAt}, sizda ${logged} belgilangan. BOL vaqtini olaman va ikkalasini ham yozaman.`,
  },

  email: {
    draftIntro: (to) => `✉️ ${to} uchun xat (inglizcha):`,
    translationNote: '🎧 ovozli xabar: xatning oʻzbekcha tarjimasi',
    send: '📤 Yuborish',
    copy: '📋 Nusxa olish',
    edit: '✏️ Oʻzgartirish',
    editPrompt: 'Nimani oʻzgartirish kerakligini ayting yoki yozing.',
    sent: (to, cc) => `📤 ${to} ga yuborildi. Nusxasi ${cc} da. Javob kelsa, tarjima qilaman.`,
    copyIntro: 'Nusxa olish uchun keyingi xabarni bosib turing:',
    writeToBroker: '✉️ Broker’ga xat',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker javob berdi: «${summary}»\nMaʼnosi: ${meaning}`,
    accept: (a) => `✅ Ha, ${a}`,
    counter: '💪 Toʻliq soʻrash',
    custom: '✏️ Oʻz javobim',
    forwardHint: 'Broker xatini yuboring yoki skrinshot tashlang, tarjima qilaman.',
  },

  loads: {
    title: 'Oxirgi yuklaringiz',
    button: '📦 Yuklar',
    empty: 'Hali yuk yoʻq. Boshlash uchun rate con yuboring.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'tekshirildi',
      booked: 'olindi',
      at_pickup: 'yuklashda',
      left_pickup: 'yoʻlda',
      at_delivery: 'tushirishda',
      left_delivery: 'yetkazildi',
      claim_sent: 'talab yuborildi',
      closed: 'yopildi',
    },
    card: (n, route, stage, det) => `📦 *Yuk #${n}*\n${route}\nHolat: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ${loads} ta yuk boʻyicha *${total}* qaytdi.`,
    nothingYet: 'Hali hech narsa qaytmadi. Keyingi omborni belgilang, har daqiqani hisoblayman.',
  },

  settings: {
    title: 'Sozlamalar',
    button: '⚙️ Sozlamalar',
    language: '🌐 Til',
    signature: '✍️ Imzo',
    email: '📧 Nusxa uchun email',
    defaultRate: '💵 Detention narxi',
    voice: '🎧 Ovozli javoblar',
    help: '❓ Yordam',
    deleteData: '🗑 Maʼlumotimni oʻchir',
    deleteConfirm: 'Barcha yuklar, hujjatlar va belgilaringiz oʻchirilsinmi? Qaytarib boʻlmaydi.',
    deleteYes: '🗑 Oʻchirish',
    deleted: 'Tayyor, hammasi oʻchirildi. Qaytadan boshlash uchun istalgan payt yozing.',
  },

  help: {
    text:
      'Men qila olaman:\n• rate con’ni tekshirish (rasm yoki PDF)\n• kelish va ketishni belgilab, detention’ni hisoblash\n• BOL’dagi vaqtni solishtirish\n• broker’ga inglizcha yozish va javobini tarjima qilish\n\nMenga oʻz tilingizda ovozli xabar yuboring.',
    example1: '📄 Rate con tekshir',
    example2: '📍 Men omborda',
  },

  errors: {
    voiceNotUnderstood: '😕 Eshitmadim. Yana ayting yoki yozing.',
    generic: '😕 Menda nimadir buzildi. Bir daqiqadan keyin urinib koʻring.',
    typeInstead: '⌨️ Yozish',
  },
};
