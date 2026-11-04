import type { Strings } from './strings.ts';

export const tr: Strings = {
  langName: 'Türkçe',

  common: {
    menu: '☰ Menü',
    back: '⬅️ Geri',
    cancel: 'İptal',
    gotIt: '👍 Anladım',
    tryAgain: '🔄 Tekrar',
    skip: 'Geç',
    more: '➡️ Daha fazla',
    duration: (h, m) => (h > 0 ? `${h} sa ${m} dk` : `${m} dk`),
    voiceNote: (s) => `🎧 sesli mesaj 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Merhaba! Ben Trucker Copilot. Rate con’ları kontrol ederim, detention’ı hesaplarım ve sizin yerinize broker’a kendi dilinizde yazarım.',
    chooseLanguage: 'Dilinizi seçin',
    chooseLanguageButton: '🌐 Dil',
    askName: 'Adınız nedir? (broker’a giden e-postalarda bu imza olacak)',
    askCompany: 'Şirket adınız veya MC numaranız?',
    askEmail: 'Her mektubun kopyası size gelsin diye e-postanız. Ya da «Geç»e basın.',
    disclaimer:
      '⚠️ Avukat değilim. Belgeleri okur, süreyi hesaplarım ama imzalamadan veya göndermeden önce rakamları mutlaka kontrol edin.',
    done: (name) => `Tamam, ${name}! Rate con’un fotoğrafını veya PDF’ini gönderin, kontrol edeyim.`,
    sendRateconButton: '📄 Rate con kontrol',
  },

  menu: {
    title: 'Neye ihtiyacınız var?',
    button: '☰ Menü',
    checkRatecon: '📄 Rate con kontrol',
    checkRateconDesc: 'Fotoğraf veya PDF: ücret, ceza, detention',
    atFacility: '📍 Depodayım',
    leftFacility: '🚚 Çıktım',
    facilityDesc: 'Detention için saati kaydet',
    broker: '✉️ Broker’a e-posta',
    brokerDesc: 'Broker’a yaz veya cevabı çevir',
    myLoads: '📦 Yüklerim',
    myLoadsDesc: 'Durum, süre, para',
    recovered: '💰 Ne kadar aldım',
    recoveredDesc: 'Size ödenen detention ve lumper',
    settings: '⚙️ Ayarlar ve yardım',
    settingsDesc: 'Dil, imza, verileri sil',
  },

  ratecon: {
    askFile: '📄 Rate con’un fotoğrafını veya PDF’ini gönderin. Birkaç sayfa olabilir.',
    reading: '👀 Belgeyi okuyorum…',
    unreadable: (p) => `😕 ${p}. sayfayı okuyamadım, fotoğraf bulanık. Daha yakından çekin veya PDF gönderin.`,
    continueWithout: '➡️ Devam',
    takePhotoAgain: '📸 Tekrar çek',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Garantili detention ödemesi yok.* Beklerseniz broker hiç ödemeyebilir.',
      late_fine: (a) => `🔴 *Gecikme cezası${a ? ` ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 Lumper’ı şoför öder, fişle geri alınır.',
      low_rpm: () => '🟡 Bu hatta mil başı ücret ortalamanın altında.',
      tonu_missing: () => '🟡 TONU ödemesi yok (yük yerinde iptal edilirse).',
      good_rate: () => '🟢 Ücret ortalamanın üstünde.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Yükleme deposu:',
        rating !== undefined ? `Google’da ★ ${rating.toFixed(1)},` : undefined,
        quote ? `şoförler «${quote}» yazıyor.` : undefined,
        avgWait ? `Şoförlerimiz orada ortalama ${avgWait} bekledi.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `İmzalamadan önce 2 saatten sonra ${rate}/saat detention istemenizi öneririm.`,
    askChanges: '✉️ Değişiklik iste',
    bookIt: '✅ Yükü alıyorum',
    reject: '❌ Reddet',
    openReviews: '⭐ Yorumlar',
    reviewsSource: 'Google Maps’te depo yorumları',
    saved: (n) => `📦 #${n} yükü kaydedildi. Yüklemeden teslimata kadar yanınızdayım.`,
  },

  stop: {
    kind: { pickup: 'yükleme', delivery: 'teslimat' },
    arrivePrompt: (k) => `${k === 'pickup' ? 'Yüklemeye' : 'Teslimata'} vardığınızda konumunuzu gönderin.`,
    arrivedButton: '📍 Vardım',
    leftButton: '🚚 Çıktım',
    fixTime: '🕒 Saati düzelt',
    howLong: '⏱ Ne kadar oldu',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Kaydedildi: *${time}* geldiniz (${place}).\nÜcretsiz süre *${freeUntil}*’e kadar, sonra ${rate}/saat. Hatırlatırım.`,
    freeTimeOver: (time) => `⏱ ${time}: 2 saatlik ücretsiz süre bitti, detention işliyor. Öneri: broker’a şimdi haber verin.`,
    warnBroker: '✉️ Haber ver',
    running: (d, a) => `⏱ Depoda ${d}. Şu ana kadar detention: *${a}*.`,
    leftPrompt: 'Çıkarken konumunuzu gönderin.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}* çıktınız. Depoda: ${onSite}.\nDetention: ${onSite} − 2 sa = *${billable} × ${rate} = ${amount}*\nBOL fotoğrafını gönderin, saatleri kontrol edeyim, mektup daha güçlü olsun.`,
    noDetention: (time, onSite) => `✅ *${time}* çıktınız. Depoda: ${onSite}, ücretsiz süre içinde.`,
    askBol: 'İmzalı BOL’un fotoğrafını gönderin.',
    sendBol: '🧾 BOL gönder',
    bolMatches: (signedAt) => `🧾 BOL ${signedAt}’te imzalanmış, kaydınızla uyuşuyor. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL’da ${signedAt}, sizin kaydınızda ${logged}. BOL saatini kullanıp ikisini de belirteceğim.`,
  },

  email: {
    draftIntro: (to) => `✉️ ${to} için mektup (İngilizce):`,
    translationNote: '🎧 sesli mesaj: mektubun Türkçe çevirisi',
    send: '📤 Gönder',
    copy: '📋 Kopyala',
    edit: '✏️ Değiştir',
    editPrompt: 'Neyi değiştireyim, söyleyin veya yazın.',
    sent: (to, cc) => `📤 ${to} adresine gönderildi. Kopyası ${cc} adresinde. Cevap gelince çeviririm.`,
    copyIntro: 'Kopyalamak için sonraki mesaja basılı tutun:',
    writeToBroker: '✉️ Broker’a e-posta',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker cevap verdi: «${summary}»\nAnlamı: ${meaning}`,
    accept: (a) => `✅ Evet, ${a}`,
    counter: '💪 Tamamını iste',
    custom: '✏️ Kendi cevabım',
    forwardHint: 'Broker’ın e-postasını iletin veya ekran görüntüsü gönderin, çevireyim.',
  },

  loads: {
    title: 'Son yükleriniz',
    button: '📦 Yükler',
    empty: 'Henüz yük yok. Başlamak için rate con gönderin.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'kontrol edildi',
      booked: 'alındı',
      at_pickup: 'yüklemede',
      left_pickup: 'yolda',
      at_delivery: 'teslimatta',
      left_delivery: 'teslim edildi',
      claim_sent: 'talep gönderildi',
      closed: 'kapandı',
    },
    card: (n, route, stage, det) => `📦 *Yük #${n}*\n${route}\nDurum: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: ${loads} yükten *${total}* geri aldınız.`,
    nothingYet: 'Henüz geri alınan yok. Sonraki durağı kaydedin, her dakikayı sayarım.',
  },

  settings: {
    title: 'Ayarlar',
    button: '⚙️ Ayarlar',
    language: '🌐 Dil',
    signature: '✍️ İmza',
    email: '📧 Kopya e-postası',
    defaultRate: '💵 Detention ücreti',
    voice: '🎧 Sesli cevaplar',
    help: '❓ Yardım',
    deleteData: '🗑 Verilerimi sil',
    deleteConfirm: 'Tüm yükleriniz, belgeleriniz ve kayıtlarınız silinsin mi? Geri alınamaz.',
    deleteYes: '🗑 Sil',
    deleted: 'Tamam, her şey silindi. Yeniden başlamak için istediğiniz zaman yazın.',
  },

  help: {
    text:
      'Yapabildiklerim:\n• rate con kontrolü (fotoğraf veya PDF)\n• varış ve çıkışı kaydedip detention hesaplama\n• BOL’daki saatleri kontrol\n• broker’a İngilizce yazıp cevabı çevirme\n\nBenimle kendi dilinizde sesli konuşun.',
    example1: '📄 Rate con kontrol',
    example2: '📍 Depodayım',
  },

  errors: {
    voiceNotUnderstood: '😕 Anlayamadım. Tekrar söyleyin veya yazın.',
    generic: '😕 Bende bir sorun oldu. Bir dakika sonra deneyin.',
    typeInstead: '⌨️ Yaz',
  },
};
