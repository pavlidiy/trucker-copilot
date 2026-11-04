import type { Strings } from './strings.ts';

export const es: Strings = {
  langName: 'Español',

  common: {
    menu: '☰ Menú',
    back: '⬅️ Atrás',
    cancel: 'Cancelar',
    gotIt: '👍 Entendido',
    tryAgain: '🔄 Otra vez',
    skip: 'Omitir',
    more: '➡️ Más',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 nota de voz 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 ¡Hola! Soy Trucker Copilot. Reviso rate cons, cuento el detention y escribo a los brokers por usted, en su idioma.',
    chooseLanguage: 'Elija su idioma',
    chooseLanguageButton: '🌐 Idioma',
    askName: '¿Cómo se llama? (así se firmarán los correos al broker)',
    askCompany: '¿Nombre de su compañía o número MC?',
    askEmail: 'Su email, para recibir copia de cada correo. O toque «Omitir».',
    disclaimer:
      '⚠️ No soy abogado. Leo documentos y cuento el tiempo, pero siempre revise las cifras antes de firmar o enviar.',
    done: (name) => `¡Listo, ${name}! Mándeme una foto o PDF del rate con y lo reviso.`,
    sendRateconButton: '📄 Revisar rate con',
  },

  menu: {
    title: '¿Qué necesita?',
    button: '☰ Menú',
    checkRatecon: '📄 Revisar rate con',
    checkRateconDesc: 'Foto o PDF: tarifa, multas, detention',
    atFacility: '📍 Estoy en el almacén',
    leftFacility: '🚚 Ya salí',
    facilityDesc: 'Registrar la hora para el detention',
    broker: '✉️ Correo al broker',
    brokerDesc: 'Escribir al broker o traducir su respuesta',
    myLoads: '📦 Mis cargas',
    myLoadsDesc: 'Estado, tiempo, dinero',
    recovered: '💰 Lo que recuperé',
    recoveredDesc: 'Detention y lumper que le pagaron',
    settings: '⚙️ Ajustes y ayuda',
    settingsDesc: 'Idioma, firma, borrar datos',
  },

  ratecon: {
    askFile: '📄 Mande una foto o PDF del rate con. Pueden ser varias páginas.',
    reading: '👀 Leyendo el documento…',
    unreadable: (p) => `😕 No pude leer la página ${p}, la foto está borrosa. Tómela más de cerca o mande el PDF.`,
    continueWithout: '➡️ Continuar',
    takePhotoAgain: '📸 Otra vez',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Detention sin pago garantizado.* Si espera, el broker puede no pagar nada.',
      late_fine: (a) => `🔴 *Multa${a ? ` de ${a}` : ''} por llegar tarde.*`,
      lumper_on_driver: () => '🟡 El chofer paga el lumper, se reembolsa con recibo.',
      low_rpm: () => '🟡 La tarifa por milla está por debajo del promedio en esta ruta.',
      tonu_missing: () => '🟡 No hay pago TONU (si cancelan la carga en el lugar).',
      good_rate: () => '🟢 La tarifa está por encima del promedio.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Almacén de carga:',
        rating !== undefined ? `★ ${rating.toFixed(1)} en Google,` : undefined,
        quote ? `los choferes escriben «${quote}».` : undefined,
        avgWait ? `Nuestros choferes esperaron ahí ${avgWait} en promedio.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Le recomiendo pedir detention de ${rate}/h después de 2 horas antes de firmar.`,
    askChanges: '✉️ Pedir cambios',
    bookIt: '✅ La tomo',
    reject: '❌ No la tomo',
    openReviews: '⭐ Reseñas',
    reviewsSource: 'Reseñas del almacén en Google Maps',
    saved: (n) => `📦 Carga #${n} guardada. Le acompaño de la carga a la entrega.`,
  },

  stop: {
    kind: { pickup: 'carga', delivery: 'entrega' },
    arrivePrompt: (k) => `Cuando llegue a la ${k === 'pickup' ? 'carga' : 'entrega'}, mande su ubicación.`,
    arrivedButton: '📍 Ya llegué',
    leftButton: '🚚 Ya salí',
    fixTime: '🕒 Corregir hora',
    howLong: '⏱ ¿Cuánto llevo?',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Registrado: llegó a las *${time}* (${place}).\nTiempo libre hasta las *${freeUntil}*, luego ${rate}/h. Le aviso.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: se acabaron las 2 horas libres, corre el detention. Consejo: avise al broker ahora.`,
    warnBroker: '✉️ Avisar al broker',
    running: (d, a) => `⏱ En el almacén ${d}. Detention hasta ahora: *${a}*.`,
    leftPrompt: 'Mande su ubicación al salir.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Salió a las *${time}*. En el almacén: ${onSite}.\nDetention: ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nMande foto del BOL, reviso las horas y el correo será más fuerte.`,
    noDetention: (time, onSite) => `✅ Salió a las *${time}*. En el almacén: ${onSite}, dentro del tiempo libre.`,
    askBol: 'Mande una foto del BOL firmado.',
    sendBol: '🧾 Mandar BOL',
    bolMatches: (signedAt) => `🧾 BOL firmado a las ${signedAt}, coincide con su registro. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 El BOL dice ${signedAt}, su registro dice ${logged}. Usaré la hora del BOL y mencionaré ambas.`,
  },

  email: {
    draftIntro: (to) => `✉️ Correo para ${to} (en inglés):`,
    translationNote: '🎧 nota de voz: lo que dice el correo, en español',
    send: '📤 Enviar',
    copy: '📋 Copiar',
    edit: '✏️ Cambiar',
    editPrompt: 'Diga o escriba qué cambiar.',
    sent: (to, cc) => `📤 Enviado a ${to}. Tiene copia en ${cc}. Le traduzco la respuesta cuando llegue.`,
    copyIntro: 'Mantenga presionado el siguiente mensaje para copiarlo:',
    writeToBroker: '✉️ Correo al broker',
  },

  reply: {
    received: (summary, meaning) => `💬 El broker respondió: «${summary}»\nSignifica: ${meaning}`,
    accept: (a) => `✅ Sí, ${a}`,
    counter: '💪 Pedir completo',
    custom: '✏️ Mi respuesta',
    forwardHint: 'Reenvíe el correo del broker o mande una captura, se lo traduzco.',
  },

  loads: {
    title: 'Sus últimas cargas',
    button: '📦 Cargas',
    empty: 'Aún no hay cargas. Mande un rate con para empezar.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'revisada',
      booked: 'tomada',
      at_pickup: 'en carga',
      left_pickup: 'en camino',
      at_delivery: 'en entrega',
      left_delivery: 'entregada',
      claim_sent: 'reclamo enviado',
      closed: 'cerrada',
    },
    card: (n, route, stage, det) => `📦 *Carga #${n}*\n${route}\nEstado: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: le pagaron *${total}* en ${loads} cargas.`,
    nothingYet: 'Aún no ha recuperado nada. Registre su próxima parada y contaré cada minuto.',
  },

  settings: {
    title: 'Ajustes',
    button: '⚙️ Ajustes',
    language: '🌐 Idioma',
    signature: '✍️ Firma',
    email: '📧 Email para copias',
    defaultRate: '💵 Tarifa detention',
    voice: '🎧 Respuestas de voz',
    help: '❓ Ayuda',
    deleteData: '🗑 Borrar mis datos',
    deleteConfirm: '¿Borrar todas sus cargas, documentos y registros? No se puede deshacer.',
    deleteYes: '🗑 Borrar',
    deleted: 'Listo, todo borrado. Escriba cuando quiera para empezar de nuevo.',
  },

  help: {
    text:
      'Puedo:\n• revisar un rate con (foto o PDF)\n• registrar llegada y salida y contar el detention\n• revisar las horas del BOL\n• escribir al broker en inglés y traducir su respuesta\n\nHábleme por voz en su idioma.',
    example1: '📄 Revisar rate con',
    example2: '📍 Estoy en el almacén',
  },

  errors: {
    voiceNotUnderstood: '😕 No le entendí. Dígalo otra vez o escríbalo.',
    generic: '😕 Algo falló de mi lado. Intente en un minuto.',
    typeInstead: '⌨️ Escribir',
  },
};
