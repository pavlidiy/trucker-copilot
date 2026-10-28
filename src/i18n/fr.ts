import type { Strings } from './strings.ts';

export const fr: Strings = {
  langName: 'Français',

  common: {
    menu: '☰ Menu',
    back: '⬅️ Retour',
    cancel: 'Annuler',
    gotIt: '👍 Compris',
    tryAgain: '🔄 Réessayer',
    skip: 'Passer',
    more: '➡️ Plus',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 message vocal 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Bonjour ! Je suis Trucker Copilot. Je vérifie les rate cons, je compte le detention et j’écris aux brokers pour vous, dans votre langue.',
    chooseLanguage: 'Choisissez votre langue',
    chooseLanguageButton: '🌐 Langue',
    askName: 'Comment vous appelez-vous ? (signature des e-mails au broker)',
    askCompany: 'Nom de votre société ou numéro MC ?',
    askEmail: 'Votre e-mail, pour recevoir une copie de chaque lettre. Ou touchez « Passer ».',
    disclaimer:
      '⚠️ Je ne suis pas avocat. Je lis les documents et je compte le temps, mais vérifiez toujours les chiffres avant de signer ou d’envoyer.',
    done: (name) => `C’est prêt, ${name} ! Envoyez-moi une photo ou un PDF du rate con et je le vérifie.`,
    sendRateconButton: '📄 Vérifier rate con',
  },

  menu: {
    title: 'De quoi avez-vous besoin ?',
    button: '☰ Menu',
    checkRatecon: '📄 Vérifier rate con',
    checkRateconDesc: 'Photo ou PDF : tarif, amendes, detention',
    atFacility: '📍 Je suis à l’entrepôt',
    leftFacility: '🚚 Je suis parti',
    facilityDesc: 'Noter l’heure pour le detention',
    broker: '✉️ E-mail au broker',
    brokerDesc: 'Écrire au broker ou traduire sa réponse',
    myLoads: '📦 Mes chargements',
    myLoadsDesc: 'Statut, temps, argent',
    recovered: '💰 Argent récupéré',
    recoveredDesc: 'Detention et lumper qu’on vous a payés',
    settings: '⚙️ Réglages et aide',
    settingsDesc: 'Langue, signature, supprimer les données',
  },

  ratecon: {
    askFile: '📄 Envoyez une photo ou un PDF du rate con. Plusieurs pages, c’est possible.',
    reading: '👀 Je lis le document…',
    unreadable: (p) => `😕 Je n’arrive pas à lire la page ${p}, la photo est floue. Reprenez-la de plus près ou envoyez le PDF.`,
    continueWithout: '➡️ Continuer',
    takePhotoAgain: '📸 Reprendre',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Pas de clause de detention.* Si vous attendez, le broker peut ne rien payer.',
      late_fine: (a) => `🔴 *Pénalité de retard${a ? ` de ${a}` : ''}.*`,
      lumper_on_driver: () => '🟡 Le chauffeur paie le lumper, remboursé sur reçu.',
      low_rpm: () => '🟡 Le tarif par mile est sous la moyenne sur ce trajet.',
      tonu_missing: () => '🟡 Pas de paiement TONU (si le chargement est annulé sur place).',
      good_rate: () => '🟢 Le tarif est au-dessus de la moyenne.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Entrepôt de chargement :',
        rating !== undefined ? `★ ${rating.toFixed(1)} sur Google,` : undefined,
        quote ? `les chauffeurs écrivent « ${quote} ».` : undefined,
        avgWait ? `Nos chauffeurs y ont attendu ${avgWait} en moyenne.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Je conseille de demander un detention de ${rate}/h après 2 heures avant de signer.`,
    askChanges: '✉️ Demander modifs',
    bookIt: '✅ Je prends',
    reject: '❌ Refuser',
    openReviews: '⭐ Avis',
    reviewsSource: 'Avis sur l’entrepôt dans Google Maps',
    saved: (n) => `📦 Chargement #${n} enregistré. Je vous accompagne du chargement à la livraison.`,
  },

  stop: {
    kind: { pickup: 'chargement', delivery: 'livraison' },
    arrivePrompt: (k) => `En arrivant au ${k === 'pickup' ? 'chargement' : 'lieu de livraison'}, envoyez votre position.`,
    arrivedButton: '📍 Je suis arrivé',
    leftButton: '🚚 Je suis parti',
    fixTime: '🕒 Corriger l’heure',
    howLong: '⏱ Depuis combien ?',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Noté : arrivé à *${time}* (${place}).\nTemps gratuit jusqu’à *${freeUntil}*, ensuite ${rate}/h. Je vous préviens.`,
    freeTimeOver: (time) =>
      `⏱ ${time} : vos 2 heures gratuites sont finies, le detention court. Conseil : prévenez le broker maintenant.`,
    warnBroker: '✉️ Prévenir broker',
    running: (d, a) => `⏱ Sur place depuis ${d}. Detention jusqu’ici : *${a}*.`,
    leftPrompt: 'Envoyez votre position en partant.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Parti à *${time}*. Sur place : ${onSite}.\nDetention : ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nEnvoyez une photo du BOL, je vérifie les heures et la lettre sera plus solide.`,
    noDetention: (time, onSite) => `✅ Parti à *${time}*. Sur place : ${onSite}, dans le temps gratuit.`,
    askBol: 'Envoyez une photo du BOL signé.',
    sendBol: '🧾 Envoyer le BOL',
    bolMatches: (signedAt) => `🧾 BOL signé à ${signedAt}, conforme à votre relevé. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 Le BOL indique ${signedAt}, votre relevé ${logged}. J’utilise l’heure du BOL et je cite les deux.`,
  },

  email: {
    draftIntro: (to) => `✉️ Lettre pour ${to} (en anglais) :`,
    translationNote: '🎧 message vocal : ce que dit la lettre, en français',
    send: '📤 Envoyer',
    copy: '📋 Copier',
    edit: '✏️ Modifier',
    editPrompt: 'Dites ou écrivez ce qu’il faut changer.',
    sent: (to, cc) => `📤 Envoyé à ${to}. Copie dans ${cc}. Je traduirai la réponse dès qu’elle arrive.`,
    copyIntro: 'Appuyez longuement sur le message suivant pour le copier :',
    writeToBroker: '✉️ E-mail au broker',
  },

  reply: {
    received: (summary, meaning) => `💬 Le broker a répondu : « ${summary} »\nEn clair : ${meaning}`,
    accept: (a) => `✅ Oui, ${a}`,
    counter: '💪 Exiger le total',
    custom: '✏️ Ma réponse',
    forwardHint: 'Transférez l’e-mail du broker ou envoyez une capture, je traduis.',
  },

  loads: {
    title: 'Vos derniers chargements',
    button: '📦 Chargements',
    empty: 'Pas encore de chargement. Envoyez un rate con pour commencer.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'vérifié',
      booked: 'accepté',
      at_pickup: 'au chargement',
      left_pickup: 'en route',
      at_delivery: 'à la livraison',
      left_delivery: 'livré',
      claim_sent: 'réclamation envoyée',
      closed: 'clôturé',
    },
    card: (n, route, stage, det) => `📦 *Chargement #${n}*\n${route}\nStatut : ${stage}\nDetention : ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month} : vous avez récupéré *${total}* sur ${loads} chargements.`,
    nothingYet: 'Rien de récupéré pour l’instant. Notez votre prochain arrêt et je compterai chaque minute.',
  },

  settings: {
    title: 'Réglages',
    button: '⚙️ Réglages',
    language: '🌐 Langue',
    signature: '✍️ Signature',
    email: '📧 E-mail des copies',
    defaultRate: '💵 Tarif detention',
    voice: '🎧 Réponses vocales',
    help: '❓ Aide',
    deleteData: '🗑 Supprimer données',
    deleteConfirm: 'Supprimer tous vos chargements, documents et relevés ? C’est définitif.',
    deleteYes: '🗑 Supprimer',
    deleted: 'C’est fait, tout est supprimé. Écrivez quand vous voulez pour recommencer.',
  },

  help: {
    text:
      'Je peux :\n• vérifier un rate con (photo ou PDF)\n• noter l’arrivée et le départ et compter le detention\n• vérifier les heures du BOL\n• écrire au broker en anglais et traduire sa réponse\n\nParlez-moi en vocal dans votre langue.',
    example1: '📄 Vérifier rate con',
    example2: '📍 Je suis à l’entrepôt',
  },

  errors: {
    voiceNotUnderstood: '😕 Je n’ai pas compris. Répétez ou écrivez.',
    generic: '😕 Un problème de mon côté. Réessayez dans une minute.',
    typeInstead: '⌨️ Écrire',
  },
};
