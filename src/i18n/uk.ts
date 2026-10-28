import type { Strings } from './strings.ts';

export const uk: Strings = {
  langName: 'Українська',

  common: {
    menu: '☰ Меню',
    back: '⬅️ Назад',
    cancel: 'Скасувати',
    gotIt: '👍 Зрозумів',
    tryAgain: '🔄 Ще раз',
    skip: 'Пропустити',
    more: '➡️ Ще',
    duration: (h, m) => (h > 0 ? `${h} год ${m} хв` : `${m} хв`),
    voiceNote: (s) => `🎧 голосове 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Вітаю! Я Trucker Copilot. Перевіряю рейт кони, рахую детеншн і пишу брокерам за вас, вашою мовою.',
    chooseLanguage: 'Оберіть мову',
    chooseLanguageButton: '🌐 Мова',
    askName: 'Як вас звати? (так буде підписано лист брокеру)',
    askCompany: 'Назва вашої компанії або номер MC?',
    askEmail: 'Ваш email, щоб копія кожного листа приходила вам. Або натисніть «Пропустити».',
    disclaimer:
      '⚠️ Я не юрист. Я читаю документи й рахую час, але завжди перевіряйте цифри перед підписом чи відправкою.',
    done: (name) => `Готово, ${name}! Надішліть фото або PDF рейт кону, і я його перевірю.`,
    sendRateconButton: '📄 Перевірити рейткон',
  },

  menu: {
    title: 'Що потрібно зробити?',
    button: '☰ Меню',
    checkRatecon: '📄 Перевірити рейткон',
    checkRateconDesc: 'Фото або PDF: ставка, штрафи, детеншн',
    atFacility: '📍 Я на складі',
    leftFacility: '🚚 Поїхав зі складу',
    facilityDesc: 'Відмітити час для детеншну',
    broker: '✉️ Лист брокеру',
    brokerDesc: 'Написати брокеру або перекласти відповідь',
    myLoads: '📦 Мої вантажі',
    myLoadsDesc: 'Статус, час, гроші',
    recovered: '💰 Скільки я повернув',
    recoveredDesc: 'Детеншн і лампер, які вам заплатили',
    settings: '⚙️ Налаштування',
    settingsDesc: 'Мова, підпис, допомога, видалити дані',
  },

  ratecon: {
    reading: '👀 Читаю документ…',
    unreadable: (p) => `😕 Не вдалося прочитати сторінку ${p}, фото розмите. Перезніміть ближче або надішліть PDF.`,
    continueWithout: '➡️ Продовжити',
    takePhotoAgain: '📸 Ще раз',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Немає пункту про детеншн.* Якщо простоїте, брокер може нічого не заплатити.',
      late_fine: (a) => `🔴 *Штраф${a ? ` ${a}` : ''} за запізнення.*`,
      lumper_on_driver: () => '🟡 Лампер оплачує водій, компенсація за чеком.',
      low_rpm: () => '🟡 Ставка за милю нижча за середню на цьому напрямку.',
      tonu_missing: () => '🟡 Немає оплати TONU (якщо вантаж скасують на місці).',
      good_rate: () => '🟢 Ставка вища за середню.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Склад завантаження:',
        rating !== undefined ? `★ ${rating.toFixed(1)} у Google,` : undefined,
        quote ? `водії пишуть «${quote}».` : undefined,
        avgWait ? `Наші водії стояли там у середньому ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Раджу до підпису попросити детеншн ${rate}/год після 2 годин.`,
    askChanges: '✉️ Попросити зміни',
    bookIt: '✅ Беру вантаж',
    reject: '❌ Відмова',
    openReviews: '⭐ Відгуки',
    reviewsSource: 'Відгуки про склад у Google Maps',
    saved: (n) => `📦 Вантаж #${n} збережено. Проведу вас від завантаження до розвантаження.`,
  },

  stop: {
    kind: { pickup: 'завантаження', delivery: 'розвантаження' },
    arrivePrompt: (k) => `Коли приїдете на ${k === 'pickup' ? 'завантаження' : 'розвантаження'}, надішліть локацію.`,
    arrivedButton: '📍 Я на місці',
    leftButton: '🚚 Поїхав',
    fixTime: '🕒 Виправити час',
    howLong: '⏱ Скільки стою',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Відмітив: приїхали о *${time}* (${place}).\nБезкоштовний час до *${freeUntil}*, далі ${rate}/год. Я нагадаю.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: безкоштовні 2 години скінчились, йде детеншн. Порада: напишіть брокеру зараз, щоб він знав.`,
    warnBroker: '✉️ Попередити',
    running: (d, a) => `⏱ На складі ${d}. Детеншн уже: *${a}*.`,
    leftPrompt: 'Надішліть локацію, коли виїжджаєте.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Поїхали о *${time}*. На складі: ${onSite}.\nДетеншн: ${onSite} − 2 год = *${billable} × ${rate} = ${amount}*\nНадішліть фото BOL, звірю час, і лист буде сильнішим.`,
    noDetention: (time, onSite) => `✅ Поїхали о *${time}*. На складі: ${onSite}, у межах безкоштовного часу.`,
    askBol: 'Надішліть фото підписаного BOL.',
    sendBol: '🧾 Надіслати BOL',
    bolMatches: (signedAt) => `🧾 BOL підписано о ${signedAt}, збігається з вашою відміткою. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 У BOL ${signedAt}, у вас відмічено ${logged}. Візьму час з BOL і згадаю обидва.`,
  },

  email: {
    draftIntro: (to) => `✉️ Лист для ${to} (англійською):`,
    translationNote: '🎧 голосове: переклад листа українською',
    send: '📤 Надіслати',
    copy: '📋 Скопіювати',
    edit: '✏️ Змінити',
    editPrompt: 'Скажіть або напишіть, що змінити.',
    sent: (to, cc) => `📤 Надіслав ${to}. Копія у вас на ${cc}. Відповідь перекладу, щойно прийде.`,
    copyIntro: 'Затисніть наступне повідомлення, щоб скопіювати:',
    writeToBroker: '✉️ Лист брокеру',
  },

  reply: {
    received: (summary, meaning) => `💬 Брокер відповів: «${summary}»\nСуть: ${meaning}`,
    accept: (a) => `✅ Так, ${a}`,
    counter: '💪 Просити повну',
    custom: '✏️ Своя відповідь',
    forwardHint: 'Перешліть лист брокера або надішліть скриншот, я перекладу.',
  },

  loads: {
    title: 'Ваші останні вантажі',
    button: '📦 Вантажі',
    empty: 'Вантажів поки немає. Надішліть рейт кон, щоб почати.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'перевірено',
      booked: 'взято',
      at_pickup: 'на завантаженні',
      left_pickup: 'в дорозі',
      at_delivery: 'на розвантаженні',
      left_delivery: 'доставлено',
      claim_sent: 'лист надіслано',
      closed: 'закрито',
    },
    card: (n, route, stage, det) => `📦 *Вантаж #${n}*\n${route}\nСтатус: ${stage}\nДетеншн: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: вам повернули *${total}* за ${loads} вантажами.`,
    nothingYet: 'Поки нічого не повернули. Відмітьте наступний склад, і я порахую кожну хвилину.',
  },

  settings: {
    title: 'Налаштування',
    button: '⚙️ Налаштування',
    language: '🌐 Мова',
    signature: '✍️ Підпис',
    email: '📧 Email для копій',
    defaultRate: '💵 Ставка детеншну',
    voice: '🎧 Голосові відповіді',
    help: '❓ Допомога',
    deleteData: '🗑 Видалити мої дані',
    deleteConfirm: 'Видалити всі ваші вантажі, документи й відмітки? Скасувати буде неможливо.',
    deleteYes: '🗑 Видалити',
    deleted: 'Готово, усе видалено. Напишіть будь-коли, щоб почати знову.',
  },

  help: {
    text:
      'Я вмію:\n• перевірити рейт кон (фото або PDF)\n• відмітити приїзд і від’їзд та порахувати детеншн\n• звірити час у BOL\n• написати брокеру англійською й перекласти відповідь\n\nГоворіть зі мною голосом своєю мовою.',
    example1: '📄 Перевірити рейткон',
    example2: '📍 Я на складі',
  },

  errors: {
    voiceNotUnderstood: '😕 Не розчув. Скажіть ще раз або напишіть.',
    generic: '😕 Щось зламалося в мене. Спробуйте за хвилину.',
    typeInstead: '⌨️ Написати',
  },
};
