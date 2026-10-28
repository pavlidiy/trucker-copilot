import type { Strings } from './strings.ts';

export const ru: Strings = {
  langName: 'Русский',

  common: {
    menu: '☰ Меню',
    back: '⬅️ Назад',
    cancel: 'Отмена',
    gotIt: '👍 Понял',
    tryAgain: '🔄 Ещё раз',
    skip: 'Пропустить',
    more: '➡️ Ещё',
    duration: (h, m) => (h > 0 ? `${h} ч ${m} мин` : `${m} мин`),
    voiceNote: (s) => `🎧 голосовое 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Здравствуйте! Я Trucker Copilot. Проверяю рейт коны, считаю детеншн и пишу брокерам за вас, на вашем языке.',
    chooseLanguage: 'Выберите язык',
    chooseLanguageButton: '🌐 Язык',
    askName: 'Как вас зовут? (так будет подписано письмо брокеру)',
    askCompany: 'Название вашей компании или номер MC?',
    askEmail: 'Ваш email, чтобы копия каждого письма приходила вам. Или нажмите «Пропустить».',
    disclaimer:
      '⚠️ Я не юрист. Я читаю документы и считаю время, но всегда проверяйте цифры перед подписью или отправкой.',
    done: (name) => `Готово, ${name}! Пришлите фото или PDF рейт кона, и я его проверю.`,
    sendRateconButton: '📄 Проверить рейт кон',
  },

  menu: {
    title: 'Что нужно сделать?',
    button: '☰ Меню',
    checkRatecon: '📄 Проверить рейт кон',
    checkRateconDesc: 'Фото или PDF: ставка, штрафы, детеншн',
    atFacility: '📍 Я на складе',
    leftFacility: '🚚 Уехал со склада',
    facilityDesc: 'Отметить время для детеншна',
    broker: '✉️ Письмо брокеру',
    brokerDesc: 'Написать брокеру или перевести ответ',
    myLoads: '📦 Мои грузы',
    myLoadsDesc: 'Статус, время, деньги',
    recovered: '💰 Сколько я вернул',
    recoveredDesc: 'Детеншн и лумпер, которые вам заплатили',
    settings: '⚙️ Настройки и помощь',
    settingsDesc: 'Язык, подпись, удалить данные',
  },

  ratecon: {
    askFile: '📄 Пришлите фото или PDF рейт кона. Можно несколько страниц.',
    reading: '👀 Читаю документ…',
    unreadable: (p) => `😕 Не смог прочитать страницу ${p}, фото размыто. Переснимите поближе или пришлите PDF.`,
    continueWithout: '➡️ Продолжить',
    takePhotoAgain: '📸 Ещё раз',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Нет пункта про детеншн.* Если простоите, брокер может ничего не заплатить.',
      late_fine: (a) => `🔴 *Штраф${a ? ` ${a}` : ''} за опоздание.*`,
      lumper_on_driver: () => '🟡 Лумпер оплачивает водитель, компенсация по чеку.',
      low_rpm: () => '🟡 Ставка за милю ниже средней по этому направлению.',
      tonu_missing: () => '🟡 Нет оплаты TONU (если груз отменят на месте).',
      good_rate: () => '🟢 Ставка выше средней.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Склад погрузки:',
        rating !== undefined ? `★ ${rating.toFixed(1)} на Google,` : undefined,
        quote ? `водители пишут «${quote}».` : undefined,
        avgWait ? `Наши водители стояли там в среднем ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Рекомендую до подписи попросить детеншн ${rate}/ч после 2 часов.`,
    askChanges: '✉️ Попросить правки',
    bookIt: '✅ Беру груз',
    reject: '❌ Отказ',
    openReviews: '⭐ Отзывы',
    reviewsSource: 'Отзывы о складе на Google Maps',
    saved: (n) => `📦 Груз #${n} сохранён. Проведу вас от погрузки до выгрузки.`,
  },

  stop: {
    kind: { pickup: 'погрузка', delivery: 'выгрузка' },
    arrivePrompt: (k) => `Когда приедете на ${k === 'pickup' ? 'погрузку' : 'выгрузку'}, отправьте локацию.`,
    arrivedButton: '📍 Я на месте',
    leftButton: '🚚 Уехал',
    fixTime: '🕒 Исправить время',
    howLong: '⏱ Сколько стою',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Отметил: приехали в *${time}* (${place}).\nБесплатное время до *${freeUntil}*, потом ${rate}/ч. Я напомню.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: бесплатные 2 часа закончились, идёт детеншн. Совет: напишите брокеру сейчас, чтобы он знал.`,
    warnBroker: '✉️ Предупредить',
    running: (d, a) => `⏱ На складе ${d}. Детеншн уже: *${a}*.`,
    leftPrompt: 'Отправьте локацию, когда выезжаете.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Уехали в *${time}*. На складе: ${onSite}.\nДетеншн: ${onSite} − 2 ч = *${billable} × ${rate} = ${amount}*\nПришлите фото BOL, сверю время, и письмо будет сильнее.`,
    noDetention: (time, onSite) => `✅ Уехали в *${time}*. На складе: ${onSite}, в пределах бесплатного времени.`,
    askBol: 'Пришлите фото подписанного BOL.',
    sendBol: '🧾 Прислать BOL',
    bolMatches: (signedAt) => `🧾 BOL подписан в ${signedAt}, совпадает с вашей отметкой. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 В BOL ${signedAt}, у вас отмечено ${logged}. Возьму время из BOL и упомяну оба.`,
  },

  email: {
    draftIntro: (to) => `✉️ Письмо для ${to} (по-английски):`,
    translationNote: '🎧 голосовое: перевод письма на русский',
    send: '📤 Отправить',
    copy: '📋 Скопировать',
    edit: '✏️ Изменить',
    editPrompt: 'Скажите или напишите, что поменять.',
    sent: (to, cc) => `📤 Отправил ${to}. Копия у вас на ${cc}. Ответ переведу, как только придёт.`,
    copyIntro: 'Зажмите следующее сообщение, чтобы скопировать:',
    writeToBroker: '✉️ Письмо брокеру',
  },

  reply: {
    received: (summary, meaning) => `💬 Брокер ответил: «${summary}»\nСмысл: ${meaning}`,
    accept: (a) => `✅ Да, ${a}`,
    counter: '💪 Просить полную',
    custom: '✏️ Свой ответ',
    forwardHint: 'Перешлите письмо брокера или пришлите скриншот, я переведу.',
  },

  loads: {
    title: 'Ваши последние грузы',
    button: '📦 Грузы',
    empty: 'Грузов пока нет. Пришлите рейт кон, чтобы начать.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'проверен',
      booked: 'взят',
      at_pickup: 'на погрузке',
      left_pickup: 'в пути',
      at_delivery: 'на выгрузке',
      left_delivery: 'доставлен',
      claim_sent: 'письмо отправлено',
      closed: 'закрыт',
    },
    card: (n, route, stage, det) => `📦 *Груз #${n}*\n${route}\nСтатус: ${stage}\nДетеншн: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: вам вернули *${total}* по ${loads} грузам.`,
    nothingYet: 'Пока ничего не вернули. Отметьте следующий склад, и я посчитаю каждую минуту.',
  },

  settings: {
    title: 'Настройки',
    button: '⚙️ Настройки',
    language: '🌐 Язык',
    signature: '✍️ Подпись',
    email: '📧 Email для копий',
    defaultRate: '💵 Ставка детеншна',
    voice: '🎧 Голосовые ответы',
    help: '❓ Помощь',
    deleteData: '🗑 Удалить мои данные',
    deleteConfirm: 'Удалить все ваши грузы, документы и отметки? Отменить будет нельзя.',
    deleteYes: '🗑 Удалить',
    deleted: 'Готово, всё удалено. Напишите в любой момент, чтобы начать заново.',
  },

  help: {
    text:
      'Я умею:\n• проверить рейт кон (фото или PDF)\n• отметить приезд и отъезд и посчитать детеншн\n• сверить время в BOL\n• написать брокеру по-английски и перевести ответ\n\nГоворите со мной голосом на своём языке.',
    example1: '📄 Проверить рейт кон',
    example2: '📍 Я на складе',
  },

  errors: {
    voiceNotUnderstood: '😕 Не расслышал. Скажите ещё раз или напишите.',
    generic: '😕 Что-то сломалось у меня. Попробуйте через минуту.',
    typeInstead: '⌨️ Написать',
  },
};
