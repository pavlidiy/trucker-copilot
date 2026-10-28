import type { Strings } from './strings.ts';

export const pl: Strings = {
  langName: 'Polski',

  common: {
    menu: '☰ Menu',
    back: '⬅️ Wstecz',
    cancel: 'Anuluj',
    gotIt: '👍 Rozumiem',
    tryAgain: '🔄 Jeszcze raz',
    skip: 'Pomiń',
    more: '➡️ Więcej',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 wiadomość głosowa 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Dzień dobry! Jestem Trucker Copilot. Sprawdzam rate cony, liczę detention i piszę do brokerów za Pana, w Pana języku.',
    chooseLanguage: 'Wybierz język',
    chooseLanguageButton: '🌐 Język',
    askName: 'Jak się Pan nazywa? (tak będą podpisane maile do brokera)',
    askCompany: 'Nazwa firmy lub numer MC?',
    askEmail: 'Pana email, żeby kopia każdego listu trafiała do Pana. Albo «Pomiń».',
    disclaimer:
      '⚠️ Nie jestem prawnikiem. Czytam dokumenty i liczę czas, ale zawsze proszę sprawdzić liczby przed podpisaniem lub wysłaniem.',
    done: (name) => `Gotowe, ${name}! Proszę wysłać zdjęcie lub PDF rate cona, sprawdzę go.`,
    sendRateconButton: '📄 Sprawdź rate con',
  },

  menu: {
    title: 'Czego Pan potrzebuje?',
    button: '☰ Menu',
    checkRatecon: '📄 Sprawdź rate con',
    checkRateconDesc: 'Zdjęcie lub PDF: stawka, kary, detention',
    atFacility: '📍 Jestem w magazynie',
    leftFacility: '🚚 Wyjechałem',
    facilityDesc: 'Zapisz czas do detention',
    broker: '✉️ Mail do brokera',
    brokerDesc: 'Napisz do brokera lub przetłumacz odpowiedź',
    myLoads: '📦 Moje ładunki',
    myLoadsDesc: 'Status, czas, pieniądze',
    recovered: '💰 Ile odzyskałem',
    recoveredDesc: 'Detention i lumper, które Panu zapłacono',
    settings: '⚙️ Ustawienia i pomoc',
    settingsDesc: 'Język, podpis, usuń dane',
  },

  ratecon: {
    askFile: '📄 Proszę wysłać zdjęcie lub PDF rate cona. Może być kilka stron.',
    reading: '👀 Czytam dokument…',
    unreadable: (p) => `😕 Nie mogę odczytać strony ${p}, zdjęcie jest rozmazane. Proszę zrobić bliżej albo wysłać PDF.`,
    continueWithout: '➡️ Dalej',
    takePhotoAgain: '📸 Jeszcze raz',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Brak klauzuli detention.* Jeśli Pan postoi, broker może nic nie zapłacić.',
      late_fine: (a) => `🔴 *Kara${a ? ` ${a}` : ''} za spóźnienie.*`,
      lumper_on_driver: () => '🟡 Lumpera płaci kierowca, zwrot na podstawie paragonu.',
      low_rpm: () => '🟡 Stawka za milę poniżej średniej na tej trasie.',
      tonu_missing: () => '🟡 Brak opłaty TONU (gdy ładunek zostanie odwołany na miejscu).',
      good_rate: () => '🟢 Stawka powyżej średniej.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Magazyn załadunku:',
        rating !== undefined ? `★ ${rating.toFixed(1)} w Google,` : undefined,
        quote ? `kierowcy piszą «${quote}».` : undefined,
        avgWait ? `Nasi kierowcy czekali tam średnio ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Przed podpisaniem radzę poprosić o detention ${rate}/h po 2 godzinach.`,
    askChanges: '✉️ Poproś o zmiany',
    bookIt: '✅ Biorę ładunek',
    reject: '❌ Odmawiam',
    openReviews: '⭐ Opinie',
    reviewsSource: 'Opinie o magazynie w Google Maps',
    saved: (n) => `📦 Ładunek #${n} zapisany. Poprowadzę Pana od załadunku do rozładunku.`,
  },

  stop: {
    kind: { pickup: 'załadunek', delivery: 'rozładunek' },
    arrivePrompt: (k) => `Po przyjeździe na ${k === 'pickup' ? 'załadunek' : 'rozładunek'} proszę wysłać lokalizację.`,
    arrivedButton: '📍 Jestem na miejscu',
    leftButton: '🚚 Wyjechałem',
    fixTime: '🕒 Popraw czas',
    howLong: '⏱ Ile już stoję',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Zapisane: przyjazd o *${time}* (${place}).\nDarmowy czas do *${freeUntil}*, potem ${rate}/h. Przypomnę.`,
    freeTimeOver: (time) => `⏱ ${time}: 2 darmowe godziny minęły, liczy się detention. Rada: proszę teraz napisać do brokera.`,
    warnBroker: '✉️ Uprzedź brokera',
    running: (d, a) => `⏱ W magazynie ${d}. Detention do tej pory: *${a}*.`,
    leftPrompt: 'Proszę wysłać lokalizację przy wyjeździe.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Wyjazd o *${time}*. W magazynie: ${onSite}.\nDetention: ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nProszę wysłać zdjęcie BOL, sprawdzę godziny i list będzie mocniejszy.`,
    noDetention: (time, onSite) => `✅ Wyjazd o *${time}*. W magazynie: ${onSite}, w darmowym czasie.`,
    askBol: 'Proszę wysłać zdjęcie podpisanego BOL.',
    sendBol: '🧾 Wyślij BOL',
    bolMatches: (signedAt) => `🧾 BOL podpisany o ${signedAt}, zgadza się z Pana zapisem. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 W BOL jest ${signedAt}, u Pana ${logged}. Wezmę czas z BOL i wspomnę oba.`,
  },

  email: {
    draftIntro: (to) => `✉️ List do ${to} (po angielsku):`,
    translationNote: '🎧 wiadomość głosowa: tłumaczenie listu na polski',
    send: '📤 Wyślij',
    copy: '📋 Kopiuj',
    edit: '✏️ Zmień',
    editPrompt: 'Proszę powiedzieć lub napisać, co zmienić.',
    sent: (to, cc) => `📤 Wysłane do ${to}. Kopia na ${cc}. Przetłumaczę odpowiedź, gdy przyjdzie.`,
    copyIntro: 'Proszę przytrzymać następną wiadomość, żeby ją skopiować:',
    writeToBroker: '✉️ Mail do brokera',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker odpisał: «${summary}»\nZnaczy to: ${meaning}`,
    accept: (a) => `✅ Tak, ${a}`,
    counter: '💪 Żądaj całości',
    custom: '✏️ Moja odpowiedź',
    forwardHint: 'Proszę przesłać maila brokera albo zrzut ekranu, przetłumaczę.',
  },

  loads: {
    title: 'Pana ostatnie ładunki',
    button: '📦 Ładunki',
    empty: 'Brak ładunków. Proszę wysłać rate con, żeby zacząć.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'sprawdzony',
      booked: 'wzięty',
      at_pickup: 'na załadunku',
      left_pickup: 'w drodze',
      at_delivery: 'na rozładunku',
      left_delivery: 'dostarczony',
      claim_sent: 'roszczenie wysłane',
      closed: 'zamknięty',
    },
    card: (n, route, stage, det) => `📦 *Ładunek #${n}*\n${route}\nStatus: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: odzyskał Pan *${total}* z ${loads} ładunków.`,
    nothingYet: 'Jeszcze nic nie odzyskano. Proszę zapisać następny postój, policzę każdą minutę.',
  },

  settings: {
    title: 'Ustawienia',
    button: '⚙️ Ustawienia',
    language: '🌐 Język',
    signature: '✍️ Podpis',
    email: '📧 Email na kopie',
    defaultRate: '💵 Stawka detention',
    voice: '🎧 Odpowiedzi głosowe',
    help: '❓ Pomoc',
    deleteData: '🗑 Usuń moje dane',
    deleteConfirm: 'Usunąć wszystkie Pana ładunki, dokumenty i zapisy? Nie da się tego cofnąć.',
    deleteYes: '🗑 Usuń',
    deleted: 'Gotowe, wszystko usunięte. Proszę napisać w dowolnej chwili, żeby zacząć od nowa.',
  },

  help: {
    text:
      'Potrafię:\n• sprawdzić rate con (zdjęcie lub PDF)\n• zapisać przyjazd i wyjazd i policzyć detention\n• sprawdzić godziny w BOL\n• napisać do brokera po angielsku i przetłumaczyć odpowiedź\n\nProszę mówić do mnie głosowo w swoim języku.',
    example1: '📄 Sprawdź rate con',
    example2: '📍 Jestem w magazynie',
  },

  errors: {
    voiceNotUnderstood: '😕 Nie dosłyszałem. Proszę powtórzyć lub napisać.',
    generic: '😕 Coś się u mnie zepsuło. Proszę spróbować za minutę.',
    typeInstead: '⌨️ Napisz',
  },
};
