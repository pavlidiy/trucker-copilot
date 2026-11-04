import type { Strings } from './strings.ts';

export const id: Strings = {
  langName: 'Bahasa Indonesia',

  common: {
    menu: '☰ Menu',
    back: '⬅️ Kembali',
    cancel: 'Batal',
    gotIt: '👍 Mengerti',
    tryAgain: '🔄 Coba lagi',
    skip: 'Lewati',
    more: '➡️ Lainnya',
    duration: (h, m) => (h > 0 ? `${h} jam ${m} mnt` : `${m} mnt`),
    voiceNote: (s) => `🎧 pesan suara 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Halo! Saya Trucker Copilot. Saya memeriksa rate con, menghitung detention, dan menulis ke broker untuk Anda, dalam bahasa Anda.',
    chooseLanguage: 'Pilih bahasa Anda',
    chooseLanguageButton: '🌐 Bahasa',
    askName: 'Siapa nama Anda? (untuk tanda tangan email ke broker)',
    askCompany: 'Nama perusahaan atau nomor MC Anda?',
    askEmail: 'Email Anda, agar salinan setiap surat dikirim ke Anda. Atau ketuk «Lewati».',
    disclaimer:
      '⚠️ Saya bukan pengacara. Saya membaca dokumen dan menghitung waktu, tapi selalu cek angkanya sebelum tanda tangan atau kirim.',
    done: (name) => `Selesai, ${name}! Kirim foto atau PDF rate con dan saya akan memeriksanya.`,
    sendRateconButton: '📄 Cek rate con',
  },

  menu: {
    title: 'Apa yang Anda perlukan?',
    button: '☰ Menu',
    checkRatecon: '📄 Cek rate con',
    checkRateconDesc: 'Foto atau PDF: tarif, denda, detention',
    atFacility: '📍 Saya di gudang',
    leftFacility: '🚚 Sudah keluar',
    facilityDesc: 'Catat waktu untuk detention',
    broker: '✉️ Email ke broker',
    brokerDesc: 'Tulis ke broker atau terjemahkan balasan',
    myLoads: '📦 Muatan saya',
    myLoadsDesc: 'Status, waktu, uang',
    recovered: '💰 Uang kembali',
    recoveredDesc: 'Detention dan lumper yang dibayar ke Anda',
    settings: '⚙️ Pengaturan & bantuan',
    settingsDesc: 'Bahasa, tanda tangan, hapus data',
  },

  ratecon: {
    askFile: '📄 Kirim foto atau PDF rate con. Boleh beberapa halaman.',
    reading: '👀 Membaca dokumen…',
    unreadable: (p) => `😕 Halaman ${p} tidak terbaca, fotonya buram. Foto lebih dekat atau kirim PDF.`,
    continueWithout: '➡️ Lanjut',
    takePhotoAgain: '📸 Foto lagi',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Tidak ada bayaran detention yang pasti.* Jika menunggu, broker bisa tidak membayar.',
      late_fine: (a) => `🔴 *Denda terlambat${a ? ` ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 Sopir membayar lumper, diganti dengan kuitansi.',
      low_rpm: () => '🟡 Tarif per mil di bawah rata-rata untuk rute ini.',
      tonu_missing: () => '🟡 Tidak ada bayaran TONU (jika muatan dibatalkan di lokasi).',
      good_rate: () => '🟢 Tarif di atas rata-rata.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Gudang muat:',
        rating !== undefined ? `★ ${rating.toFixed(1)} di Google,` : undefined,
        quote ? `sopir menulis «${quote}».` : undefined,
        avgWait ? `Sopir kami menunggu di sana rata-rata ${avgWait}.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Saya sarankan minta detention ${rate}/jam setelah 2 jam sebelum tanda tangan.`,
    askChanges: '✉️ Minta perubahan',
    bookIt: '✅ Ambil muatan',
    reject: '❌ Tolak',
    openReviews: '⭐ Ulasan',
    reviewsSource: 'Ulasan gudang di Google Maps',
    saved: (n) => `📦 Muatan #${n} disimpan. Saya temani dari muat sampai bongkar.`,
  },

  stop: {
    kind: { pickup: 'muat', delivery: 'bongkar' },
    arrivePrompt: (k) => `Saat tiba di lokasi ${k === 'pickup' ? 'muat' : 'bongkar'}, kirim lokasi Anda.`,
    arrivedButton: '📍 Saya sudah tiba',
    leftButton: '🚚 Sudah keluar',
    fixTime: '🕒 Ubah waktu',
    howLong: '⏱ Sudah berapa lama',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Dicatat: tiba pukul *${time}* (${place}).\nWaktu gratis sampai *${freeUntil}*, lalu ${rate}/jam. Saya akan ingatkan.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: 2 jam gratis sudah habis, detention berjalan. Saran: kabari broker sekarang.`,
    warnBroker: '✉️ Kabari broker',
    running: (d, a) => `⏱ Di gudang ${d}. Detention sejauh ini: *${a}*.`,
    leftPrompt: 'Kirim lokasi Anda saat keluar.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Keluar pukul *${time}*. Di gudang: ${onSite}.\nDetention: ${onSite} − 2 jam = *${billable} × ${rate} = ${amount}*\nKirim foto BOL, saya cek waktunya dan surat jadi lebih kuat.`,
    noDetention: (time, onSite) => `✅ Keluar pukul *${time}*. Di gudang: ${onSite}, masih dalam waktu gratis.`,
    askBol: 'Kirim foto BOL yang sudah ditandatangani.',
    sendBol: '🧾 Kirim BOL',
    bolMatches: (signedAt) => `🧾 BOL ditandatangani pukul ${signedAt}, sesuai catatan Anda. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 BOL menulis ${signedAt}, catatan Anda ${logged}. Saya pakai waktu BOL dan sebut keduanya.`,
  },

  email: {
    draftIntro: (to) => `✉️ Surat untuk ${to} (bahasa Inggris):`,
    translationNote: '🎧 pesan suara: isi surat dalam bahasa Indonesia',
    send: '📤 Kirim',
    copy: '📋 Salin',
    edit: '✏️ Ubah',
    editPrompt: 'Ucapkan atau tulis apa yang diubah.',
    sent: (to, cc) => `📤 Terkirim ke ${to}. Salinan ada di ${cc}. Saya terjemahkan balasannya nanti.`,
    copyIntro: 'Tekan lama pesan berikut untuk menyalin:',
    writeToBroker: '✉️ Email ke broker',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker membalas: «${summary}»\nArtinya: ${meaning}`,
    accept: (a) => `✅ Setuju ${a}`,
    counter: '💪 Minta penuh',
    custom: '✏️ Jawaban saya',
    forwardHint: 'Teruskan email broker atau kirim tangkapan layar, saya terjemahkan.',
  },

  loads: {
    title: 'Muatan terakhir Anda',
    button: '📦 Muatan',
    empty: 'Belum ada muatan. Kirim rate con untuk mulai.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'dicek',
      booked: 'diambil',
      at_pickup: 'di lokasi muat',
      left_pickup: 'di jalan',
      at_delivery: 'di lokasi bongkar',
      left_delivery: 'terkirim',
      claim_sent: 'klaim dikirim',
      closed: 'selesai',
    },
    card: (n, route, stage, det) => `📦 *Muatan #${n}*\n${route}\nStatus: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: Anda mendapat kembali *${total}* dari ${loads} muatan.`,
    nothingYet: 'Belum ada yang kembali. Catat pemberhentian berikutnya dan saya hitung tiap menit.',
  },

  settings: {
    title: 'Pengaturan',
    button: '⚙️ Pengaturan',
    language: '🌐 Bahasa',
    signature: '✍️ Tanda tangan',
    email: '📧 Email salinan',
    defaultRate: '💵 Tarif detention',
    voice: '🎧 Balasan suara',
    help: '❓ Bantuan',
    deleteData: '🗑 Hapus data saya',
    deleteConfirm: 'Hapus semua muatan, dokumen, dan catatan Anda? Tidak bisa dibatalkan.',
    deleteYes: '🗑 Hapus',
    deleted: 'Selesai, semua sudah dihapus. Tulis kapan saja untuk mulai lagi.',
  },

  help: {
    text:
      'Saya bisa:\n• cek rate con (foto atau PDF)\n• catat tiba dan keluar, hitung detention\n• cek waktu di BOL\n• menulis ke broker dalam bahasa Inggris dan menerjemahkan balasannya\n\nBicara dengan saya lewat pesan suara dalam bahasa Anda.',
    example1: '📄 Cek rate con',
    example2: '📍 Saya di gudang',
  },

  errors: {
    voiceNotUnderstood: '😕 Saya tidak menangkap. Ulangi atau ketik.',
    generic: '😕 Ada masalah di sisi saya. Coba lagi sebentar.',
    typeInstead: '⌨️ Ketik',
  },
};
