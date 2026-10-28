import type { Strings } from './strings.ts';

export const pt: Strings = {
  langName: 'Português',

  common: {
    menu: '☰ Menu',
    back: '⬅️ Voltar',
    cancel: 'Cancelar',
    gotIt: '👍 Entendi',
    tryAgain: '🔄 De novo',
    skip: 'Pular',
    more: '➡️ Mais',
    duration: (h, m) => (h > 0 ? `${h} h ${m} min` : `${m} min`),
    voiceNote: (s) => `🎧 áudio 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome:
      '👋 Olá! Sou o Trucker Copilot. Confiro rate cons, conto o detention e escrevo aos brokers por você, no seu idioma.',
    chooseLanguage: 'Escolha seu idioma',
    chooseLanguageButton: '🌐 Idioma',
    askName: 'Qual é o seu nome? (assim os e-mails ao broker serão assinados)',
    askCompany: 'Nome da sua empresa ou número MC?',
    askEmail: 'Seu e-mail, para receber cópia de cada carta. Ou toque em «Pular».',
    disclaimer:
      '⚠️ Não sou advogado. Leio documentos e conto o tempo, mas sempre confira os números antes de assinar ou enviar.',
    done: (name) => `Pronto, ${name}! Mande uma foto ou PDF do rate con e eu confiro.`,
    sendRateconButton: '📄 Conferir rate con',
  },

  menu: {
    title: 'Do que você precisa?',
    button: '☰ Menu',
    checkRatecon: '📄 Conferir rate con',
    checkRateconDesc: 'Foto ou PDF: valor, multas, detention',
    atFacility: '📍 Estou no armazém',
    leftFacility: '🚚 Já saí',
    facilityDesc: 'Registrar horário para o detention',
    broker: '✉️ E-mail ao broker',
    brokerDesc: 'Escrever ao broker ou traduzir a resposta',
    myLoads: '📦 Minhas cargas',
    myLoadsDesc: 'Status, tempo, dinheiro',
    recovered: '💰 Quanto recuperei',
    recoveredDesc: 'Detention e lumper que pagaram a você',
    settings: '⚙️ Ajustes e ajuda',
    settingsDesc: 'Idioma, assinatura, apagar dados',
  },

  ratecon: {
    reading: '👀 Lendo o documento…',
    unreadable: (p) => `😕 Não consegui ler a página ${p}, a foto está borrada. Tire mais de perto ou mande o PDF.`,
    continueWithout: '➡️ Continuar',
    takePhotoAgain: '📸 De novo',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *Não há cláusula de detention.* Se esperar, o broker pode não pagar nada.',
      late_fine: (a) => `🔴 *Multa${a ? ` de ${a}` : ''} por atraso.*`,
      lumper_on_driver: () => '🟡 O motorista paga o lumper, reembolso com recibo.',
      low_rpm: () => '🟡 O valor por milha está abaixo da média nesta rota.',
      tonu_missing: () => '🟡 Não há pagamento TONU (se cancelarem a carga no local).',
      good_rate: () => '🟢 O valor está acima da média.',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ Armazém de coleta:',
        rating !== undefined ? `★ ${rating.toFixed(1)} no Google,` : undefined,
        quote ? `motoristas escrevem «${quote}».` : undefined,
        avgWait ? `Nossos motoristas esperaram lá ${avgWait} em média.` : undefined,
      ]
        .filter(Boolean)
        .join(' '),
    recommendDetention: (rate) => `Recomendo pedir detention de ${rate}/h após 2 horas antes de assinar.`,
    askChanges: '✉️ Pedir mudanças',
    bookIt: '✅ Aceito a carga',
    reject: '❌ Recusar',
    openReviews: '⭐ Avaliações',
    reviewsSource: 'Avaliações do armazém no Google Maps',
    saved: (n) => `📦 Carga #${n} salva. Vou te guiar da coleta à entrega.`,
  },

  stop: {
    kind: { pickup: 'coleta', delivery: 'entrega' },
    arrivePrompt: (k) => `Quando chegar na ${k === 'pickup' ? 'coleta' : 'entrega'}, mande sua localização.`,
    arrivedButton: '📍 Cheguei',
    leftButton: '🚚 Já saí',
    fixTime: '🕒 Corrigir hora',
    howLong: '⏱ Quanto tempo?',
    arrived: (time, place, freeUntil, rate) =>
      `📍 Registrado: chegou às *${time}* (${place}).\nTempo livre até *${freeUntil}*, depois ${rate}/h. Eu aviso.`,
    freeTimeOver: (time) =>
      `⏱ ${time}: acabaram as 2 horas livres, o detention está correndo. Dica: avise o broker agora.`,
    warnBroker: '✉️ Avisar broker',
    running: (d, a) => `⏱ No armazém há ${d}. Detention até agora: *${a}*.`,
    leftPrompt: 'Mande sua localização ao sair.',
    left: (time, onSite, billable, rate, amount) =>
      `✅ Saiu às *${time}*. No armazém: ${onSite}.\nDetention: ${onSite} − 2 h = *${billable} × ${rate} = ${amount}*\nMande foto do BOL, confiro os horários e o e-mail fica mais forte.`,
    noDetention: (time, onSite) => `✅ Saiu às *${time}*. No armazém: ${onSite}, dentro do tempo livre.`,
    askBol: 'Mande uma foto do BOL assinado.',
    sendBol: '🧾 Mandar BOL',
    bolMatches: (signedAt) => `🧾 BOL assinado às ${signedAt}, bate com seu registro. ✅`,
    bolMismatch: (signedAt, logged) =>
      `🧾 O BOL diz ${signedAt}, seu registro diz ${logged}. Vou usar a hora do BOL e citar as duas.`,
  },

  email: {
    draftIntro: (to) => `✉️ E-mail para ${to} (em inglês):`,
    translationNote: '🎧 áudio: o que diz o e-mail, em português',
    send: '📤 Enviar',
    copy: '📋 Copiar',
    edit: '✏️ Alterar',
    editPrompt: 'Diga ou escreva o que mudar.',
    sent: (to, cc) => `📤 Enviado para ${to}. Cópia em ${cc}. Traduzo a resposta quando chegar.`,
    copyIntro: 'Segure a próxima mensagem para copiar:',
    writeToBroker: '✉️ E-mail ao broker',
  },

  reply: {
    received: (summary, meaning) => `💬 O broker respondeu: «${summary}»\nSignifica: ${meaning}`,
    accept: (a) => `✅ Sim, ${a}`,
    counter: '💪 Pedir o total',
    custom: '✏️ Minha resposta',
    forwardHint: 'Encaminhe o e-mail do broker ou mande um print, eu traduzo.',
  },

  loads: {
    title: 'Suas últimas cargas',
    button: '📦 Cargas',
    empty: 'Ainda não há cargas. Mande um rate con para começar.',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: 'conferida',
      booked: 'aceita',
      at_pickup: 'na coleta',
      left_pickup: 'em trânsito',
      at_delivery: 'na entrega',
      left_delivery: 'entregue',
      claim_sent: 'cobrança enviada',
      closed: 'fechada',
    },
    card: (n, route, stage, det) => `📦 *Carga #${n}*\n${route}\nStatus: ${stage}\nDetention: ${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}: você recuperou *${total}* em ${loads} cargas.`,
    nothingYet: 'Nada recuperado ainda. Registre a próxima parada e eu conto cada minuto.',
  },

  settings: {
    title: 'Ajustes',
    button: '⚙️ Ajustes',
    language: '🌐 Idioma',
    signature: '✍️ Assinatura',
    email: '📧 E-mail para cópias',
    defaultRate: '💵 Valor detention',
    voice: '🎧 Respostas em áudio',
    help: '❓ Ajuda',
    deleteData: '🗑 Apagar meus dados',
    deleteConfirm: 'Apagar todas as suas cargas, documentos e registros? Não dá para desfazer.',
    deleteYes: '🗑 Apagar',
    deleted: 'Pronto, tudo apagado. Escreva quando quiser para começar de novo.',
  },

  help: {
    text:
      'Eu posso:\n• conferir um rate con (foto ou PDF)\n• registrar chegada e saída e contar o detention\n• conferir os horários do BOL\n• escrever ao broker em inglês e traduzir a resposta\n\nFale comigo por áudio no seu idioma.',
    example1: '📄 Conferir rate con',
    example2: '📍 Estou no armazém',
  },

  errors: {
    voiceNotUnderstood: '😕 Não entendi. Fale de novo ou escreva.',
    generic: '😕 Algo deu errado do meu lado. Tente em um minuto.',
    typeInstead: '⌨️ Escrever',
  },
};
