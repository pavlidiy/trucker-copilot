import type { Strings } from './strings.ts';

export const ar: Strings = {
  langName: 'العربية',

  common: {
    menu: '☰ القائمة',
    back: '⬅️ رجوع',
    cancel: 'إلغاء',
    gotIt: '👍 فهمت',
    tryAgain: '🔄 مرة أخرى',
    skip: 'تخطي',
    more: '➡️ المزيد',
    duration: (h, m) => (h > 0 ? `${h} س ${m} د` : `${m} د`),
    voiceNote: (s) => `🎧 رسالة صوتية 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 مرحبًا! أنا Trucker Copilot. أراجع الـ rate con وأحسب الـ detention وأكتب للـ broker نيابةً عنك، بلغتك.',
    chooseLanguage: 'اختر لغتك',
    chooseLanguageButton: '🌐 اللغة',
    askName: 'ما اسمك؟ (سيظهر في توقيع الرسائل إلى الـ broker)',
    askCompany: 'اسم شركتك أو رقم MC؟',
    askEmail: 'بريدك الإلكتروني لتصلك نسخة من كل رسالة. أو اضغط «تخطي».',
    disclaimer:
      '⚠️ أنا لست محاميًا. أقرأ المستندات وأحسب الوقت، لكن راجع الأرقام دائمًا قبل التوقيع أو الإرسال.',
    done: (name) => `تم يا ${name}! أرسل صورة أو PDF للـ rate con وسأراجعه.`,
    sendRateconButton: '📄 راجع rate con',
  },

  menu: {
    title: 'ماذا تحتاج؟',
    button: '☰ القائمة',
    checkRatecon: '📄 راجع rate con',
    checkRateconDesc: 'صورة أو PDF: السعر، الغرامات، detention',
    atFacility: '📍 أنا في المستودع',
    leftFacility: '🚚 غادرت',
    facilityDesc: 'سجّل الوقت لحساب الـ detention',
    broker: '✉️ رسالة للـ broker',
    brokerDesc: 'اكتب للـ broker أو ترجم رده',
    myLoads: '📦 شحناتي',
    myLoadsDesc: 'الحالة، الوقت، المال',
    recovered: '💰 كم استرجعت',
    recoveredDesc: 'detention و lumper دُفعت لك',
    settings: '⚙️ الإعدادات والمساعدة',
    settingsDesc: 'اللغة، التوقيع، حذف البيانات',
  },

  ratecon: {
    askFile: '📄 أرسل صورة أو PDF للـ rate con. يمكن إرسال عدة صفحات.',
    reading: '👀 أقرأ المستند…',
    unreadable: (p) => `😕 لم أستطع قراءة الصفحة ${p}، الصورة غير واضحة. صوّرها عن قرب أو أرسل PDF.`,
    continueWithout: '➡️ متابعة',
    takePhotoAgain: '📸 مرة أخرى',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *لا يوجد أجر detention مضمون.* إذا انتظرت، قد لا يدفع الـ broker شيئًا.',
      late_fine: (a) => `🔴 *غرامة تأخير${a ? ` ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 السائق يدفع الـ lumper، ويُسترد بالإيصال.',
      low_rpm: () => '🟡 السعر لكل ميل أقل من المتوسط على هذا الخط.',
      tonu_missing: () => '🟡 لا يوجد دفع TONU (إذا أُلغيت الشحنة في الموقع).',
      good_rate: () => '🟢 السعر أعلى من المتوسط.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ مستودع التحميل:',
        rating !== undefined ? `★ ${rating.toFixed(1)} على Google،` : undefined,
        quote ? `يكتب السائقون «${quote}».` : undefined,
        avgWait ? `انتظر سائقونا هناك ${avgWait} في المتوسط.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `أنصح بطلب detention بقيمة ${rate}/ساعة بعد ساعتين قبل التوقيع.`,
    askChanges: '✉️ اطلب تعديلات',
    bookIt: '✅ آخذ الشحنة',
    reject: '❌ رفض',
    openReviews: '⭐ التقييمات',
    reviewsSource: 'تقييمات المستودع على Google Maps',
    saved: (n) => `📦 تم حفظ الشحنة #${n}. سأرافقك من التحميل حتى التسليم.`,
  },

  stop: {
    kind: { pickup: 'التحميل', delivery: 'التسليم' },
    arrivePrompt: (k) => `عند وصولك إلى ${k === 'pickup' ? 'التحميل' : 'التسليم'}، أرسل موقعك.`,
    arrivedButton: '📍 وصلت',
    leftButton: '🚚 غادرت',
    fixTime: '🕒 تعديل الوقت',
    howLong: '⏱ كم انتظرت؟',
    arrived: (time, place, freeUntil, rate) =>
      `📍 سُجّل: وصلت الساعة *${time}* (${place}).\nالوقت المجاني حتى *${freeUntil}*، بعدها ${rate}/ساعة. سأذكّرك.`,
    freeTimeOver: (time) => `⏱ ${time}: انتهت الساعتان المجانيتان، الـ detention يُحتسب الآن. نصيحة: أبلغ الـ broker الآن.`,
    warnBroker: '✉️ أبلغ الـ broker',
    running: (d, a) => `⏱ في المستودع منذ ${d}. الـ detention حتى الآن: *${a}*.`,
    leftPrompt: 'أرسل موقعك عند المغادرة.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ غادرت الساعة *${time}*. في المستودع: ${onSite}.\nDetention: ${onSite} − 2 س = *${billable} × ${rate} = ${amount}*\nأرسل صورة الـ BOL لأطابق الأوقات وتصبح الرسالة أقوى.`,
    noDetention: (time, onSite) => `✅ غادرت الساعة *${time}*. في المستودع: ${onSite}، ضمن الوقت المجاني.`,
    askBol: 'أرسل صورة الـ BOL الموقّع.',
    sendBol: '🧾 أرسل BOL',
    bolMatches: (signedAt) => `🧾 وُقّع الـ BOL الساعة ${signedAt}، يطابق تسجيلك. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 في الـ BOL ${signedAt}، وفي تسجيلك ${logged}. سأعتمد وقت الـ BOL وأذكر الاثنين.`,
  },

  email: {
    draftIntro: (to) => `✉️ رسالة إلى ${to} (بالإنجليزية):`,
    translationNote: '🎧 رسالة صوتية: ترجمة الرسالة بالعربية',
    send: '📤 إرسال',
    copy: '📋 نسخ',
    edit: '✏️ تعديل',
    editPrompt: 'قل أو اكتب ما تريد تغييره.',
    sent: (to, cc) => `📤 أُرسلت إلى ${to}. نسخة في ${cc}. سأترجم الرد عند وصوله.`,
    copyIntro: 'اضغط مطولًا على الرسالة التالية لنسخها:',
    writeToBroker: '✉️ رسالة للـ broker',
  },

  reply: {
    received: (summary, meaning) => `💬 ردّ الـ broker: «${summary}»\nالمعنى: ${meaning}`,
    accept: (a) => `✅ موافق ${a}`,
    counter: '💪 اطلب المبلغ كاملًا',
    custom: '✏️ ردّي',
    forwardHint: 'أعد توجيه رسالة الـ broker أو أرسل لقطة شاشة، وسأترجمها.',
  },

  loads: {
    title: 'شحناتك الأخيرة',
    button: '📦 الشحنات',
    empty: 'لا توجد شحنات بعد. أرسل rate con للبدء.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'تمت المراجعة',
      booked: 'مأخوذة',
      at_pickup: 'في التحميل',
      left_pickup: 'في الطريق',
      at_delivery: 'في التسليم',
      left_delivery: 'سُلّمت',
      claim_sent: 'أُرسلت المطالبة',
      closed: 'مغلقة',
    },
    card: (n, route, stage, det) => `📦 *الشحنة #${n}*\n${route}\nالحالة: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: استرجعت *${total}* من ${loads} شحنات.`,
    nothingYet: 'لم تسترجع شيئًا بعد. سجّل محطتك القادمة وسأحسب كل دقيقة.',
  },

  settings: {
    title: 'الإعدادات',
    button: '⚙️ الإعدادات',
    language: '🌐 اللغة',
    signature: '✍️ التوقيع',
    email: '📧 بريد النسخ',
    defaultRate: '💵 سعر detention',
    voice: '🎧 الردود الصوتية',
    help: '❓ مساعدة',
    deleteData: '🗑 احذف بياناتي',
    deleteConfirm: 'حذف كل شحناتك ومستنداتك وتسجيلاتك؟ لا يمكن التراجع.',
    deleteYes: '🗑 حذف',
    deleted: 'تم حذف كل شيء. اكتب في أي وقت للبدء من جديد.',
  },

  help: {
    text:
      'أستطيع:\n• مراجعة rate con (صورة أو PDF)\n• تسجيل الوصول والمغادرة وحساب الـ detention\n• مطابقة أوقات الـ BOL\n• الكتابة للـ broker بالإنجليزية وترجمة رده\n\nتحدث معي برسالة صوتية بلغتك.',
    example1: '📄 راجع rate con',
    example2: '📍 أنا في المستودع',
  },

  errors: {
    voiceNotUnderstood: '😕 لم أفهم. قلها مرة أخرى أو اكتبها.',
    generic: '😕 حدث خطأ من جهتي. حاول بعد دقيقة.',
    typeInstead: '⌨️ اكتب',
  },
};
