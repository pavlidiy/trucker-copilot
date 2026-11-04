import type { OutgoingMessage } from './types.ts';

/** Plain-text picture of a message as the driver would see it. Used by the preview and tests. */
export function render(msg: OutgoingMessage): string {
  if (msg.type === 'text') return msg.text.body;
  const i = msg.interactive;
  const parts: string[] = [];
  if ('header' in i && i.header) parts.push(`*${i.header.text}*`);
  parts.push(i.body.text);
  if ('footer' in i && i.footer) parts.push(`_${i.footer.text}_`);
  switch (i.type) {
    case 'button':
      parts.push(i.action.buttons.map((b) => `[${b.reply.title}]`).join(' '));
      break;
    case 'list':
      parts.push(`[${i.action.button} ▾]`);
      for (const section of i.action.sections) {
        if (section.title) parts.push(`  ${section.title}`);
        for (const row of section.rows) {
          parts.push(`  • ${row.title}${row.description ? `  (${row.description})` : ''}`);
        }
      }
      break;
    case 'cta_url':
      parts.push(`[🔗 ${i.action.parameters.display_text}]`);
      break;
    case 'location_request_message':
      parts.push('[📍 Send location]');
      break;
  }
  return parts.join('\n');
}
