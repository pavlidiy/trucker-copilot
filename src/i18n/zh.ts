import type { Strings } from './strings.ts';

export const zh: Strings = {
  langName: '中文',

  common: {
    menu: '☰ 菜单',
    back: '⬅️ 返回',
    cancel: '取消',
    gotIt: '👍 明白',
    tryAgain: '🔄 再试一次',
    skip: '跳过',
    more: '➡️ 更多',
    duration: (h, m) => (h > 0 ? `${h}小时${m}分钟` : `${m}分钟`),
    voiceNote: (s) => `🎧 语音 0:${String(s).padStart(2, '0')}`,
  },

  onboarding: {
    welcome: '👋 您好！我是 Trucker Copilot。我用您的语言帮您检查 rate con、计算 detention、给 broker 写邮件。',
    chooseLanguage: '请选择语言',
    chooseLanguageButton: '🌐 语言',
    askName: '您叫什么名字？（用于给 broker 的邮件署名）',
    askCompany: '您的公司名称或 MC 号码？',
    askEmail: '您的邮箱，每封信都会抄送给您。或点击「跳过」。',
    disclaimer: '⚠️ 我不是律师。我读文件、算时间，但签字或发送前请务必核对数字。',
    done: (name) => `好了，${name}！请发送 rate con 的照片或 PDF，我来检查。`,
    sendRateconButton: '📄 检查 rate con',
  },

  menu: {
    title: '您需要什么？',
    button: '☰ 菜单',
    checkRatecon: '📄 检查 rate con',
    checkRateconDesc: '照片或 PDF：运费、罚款、detention',
    atFacility: '📍 我到仓库了',
    leftFacility: '🚚 我已离开',
    facilityDesc: '记录时间，用于 detention',
    broker: '✉️ 给 broker 写信',
    brokerDesc: '写信给 broker 或翻译回复',
    myLoads: '📦 我的货单',
    myLoadsDesc: '状态、时间、金额',
    recovered: '💰 我拿回了多少',
    recoveredDesc: '已付给您的 detention 和 lumper',
    settings: '⚙️ 设置和帮助',
    settingsDesc: '语言、签名、删除数据',
  },

  ratecon: {
    askFile: '📄 请发送 rate con 的照片或 PDF，可以多页。',
    reading: '👀 正在读取文件…',
    unreadable: (p) => `😕 第 ${p} 页看不清，照片模糊。请靠近重拍或发送 PDF。`,
    continueWithout: '➡️ 继续',
    takePhotoAgain: '📸 重拍',
    route: (from, to) => `${from} → ${to}`,
    risk: {
      no_detention_clause: () => '🔴 *没有保证的 detention 费。* 如果等待，broker 可能一分不付。',
      late_fine: (a) => `🔴 *迟到罚款${a ? ` ${a}` : ''}。*`,
      lumper_on_driver: () => '🟡 司机先付 lumper，凭收据报销。',
      low_rpm: () => '🟡 每英里运价低于这条线路的平均水平。',
      tonu_missing: () => '🟡 没有 TONU 费用（到场后取消的补偿）。',
      good_rate: () => '🟢 运价高于平均水平。',
    },
    reputation: (rating, quote, avgWait) =>
      [
        '⚠️ 装货仓库：',
        rating !== undefined ? `Google 评分 ★ ${rating.toFixed(1)}，` : undefined,
        quote ? `司机评价「${quote}」。` : undefined,
        avgWait ? `我们的司机平均在那里等了 ${avgWait}。` : undefined,
      ]
        .filter(Boolean)
        .join(''),
    recommendDetention: (rate) => `建议签字前要求加上：2 小时后 detention 每小时 ${rate}。`,
    askChanges: '✉️ 要求修改',
    bookIt: '✅ 接这单',
    reject: '❌ 不接',
    openReviews: '⭐ 评价',
    reviewsSource: 'Google 地图上的仓库评价',
    saved: (n) => `📦 货单 #${n} 已保存。我会陪您从装货到卸货。`,
  },

  stop: {
    kind: { pickup: '装货', delivery: '卸货' },
    arrivePrompt: (k) => `到达${k === 'pickup' ? '装货' : '卸货'}地点时，请发送位置。`,
    arrivedButton: '📍 我到了',
    leftButton: '🚚 我已离开',
    fixTime: '🕒 修改时间',
    howLong: '⏱ 等了多久',
    arrived: (time, place, freeUntil, rate) =>
      `📍 已记录：*${time}* 到达（${place}）。\n免费时间到 *${freeUntil}*，之后每小时 ${rate}。我会提醒您。`,
    freeTimeOver: (time) => `⏱ ${time}：2 小时免费时间已结束，开始计 detention。建议现在通知 broker。`,
    warnBroker: '✉️ 通知 broker',
    running: (d, a) => `⏱ 已在仓库 ${d}。目前 detention：*${a}*。`,
    leftPrompt: '离开时请发送位置。',
    left: (time, onSite, billable, rate, amount) =>
      `✅ *${time}* 离开。在仓库：${onSite}。\nDetention：${onSite} − 2小时 = *${billable} × ${rate} = ${amount}*\n请发 BOL 照片，我核对时间，信会更有力。`,
    noDetention: (time, onSite) => `✅ *${time}* 离开。在仓库：${onSite}，在免费时间内。`,
    askBol: '请发送已签字的 BOL 照片。',
    sendBol: '🧾 发送 BOL',
    bolMatches: (signedAt) => `🧾 BOL 签字时间 ${signedAt}，与您的记录一致。✅`,
    bolMismatch: (signedAt, logged) => `🧾 BOL 上是 ${signedAt}，您记录的是 ${logged}。我会用 BOL 时间并同时注明两者。`,
  },

  email: {
    draftIntro: (to) => `✉️ 给 ${to} 的信（英文）：`,
    translationNote: '🎧 语音：信件内容的中文翻译',
    send: '📤 发送',
    copy: '📋 复制',
    edit: '✏️ 修改',
    editPrompt: '请说或写出要修改的地方。',
    sent: (to, cc) => `📤 已发送给 ${to}。副本在 ${cc}。回复到了我会翻译给您。`,
    copyIntro: '长按下一条消息即可复制：',
    writeToBroker: '✉️ 给 broker 写信',
  },

  reply: {
    received: (summary, meaning) => `💬 Broker 回复：「${summary}」\n意思是：${meaning}`,
    accept: (a) => `✅ 同意 ${a}`,
    counter: '💪 要求全额',
    custom: '✏️ 我自己回复',
    forwardHint: '转发 broker 的邮件或发截图，我来翻译。',
  },

  loads: {
    title: '您最近的货单',
    button: '📦 货单',
    empty: '还没有货单。发送 rate con 开始。',
    row: (from, to) => `${from} → ${to}`,
    stage: {
      checked: '已检查',
      booked: '已接单',
      at_pickup: '装货中',
      left_pickup: '运输中',
      at_delivery: '卸货中',
      left_delivery: '已送达',
      claim_sent: '已发索赔',
      closed: '已结束',
    },
    card: (n, route, stage, det) => `📦 *货单 #${n}*\n${route}\n状态：${stage}\nDetention：${det}`,
  },

  recovered: {
    summary: (month, total, loads) => `💰 ${month}：${loads} 单共拿回 *${total}*。`,
    nothingYet: '还没有拿回的钱。下次到站时记录，我会算好每一分钟。',
  },

  settings: {
    title: '设置',
    button: '⚙️ 设置',
    language: '🌐 语言',
    signature: '✍️ 签名',
    email: '📧 抄送邮箱',
    defaultRate: '💵 Detention 费率',
    voice: '🎧 语音回复',
    help: '❓ 帮助',
    deleteData: '🗑 删除我的数据',
    deleteConfirm: '删除您所有的货单、文件和记录？此操作无法撤销。',
    deleteYes: '🗑 删除',
    deleted: '已全部删除。随时发消息即可重新开始。',
  },

  help: {
    text:
      '我可以：\n• 检查 rate con（照片或 PDF）\n• 记录到达和离开，计算 detention\n• 核对 BOL 上的时间\n• 用英文给 broker 写信并翻译回复\n\n用您的语言发语音给我就行。',
    example1: '📄 检查 rate con',
    example2: '📍 我到仓库了',
  },

  errors: {
    voiceNotUnderstood: '😕 没听清。请再说一遍或打字。',
    generic: '😕 我这边出了问题。请一分钟后再试。',
    typeInstead: '⌨️ 打字',
  },
};
