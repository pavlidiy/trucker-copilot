import type {
  ButtonMessage,
  Choice,
  CtaUrlMessage,
  ListMessage,
  ListSection,
  LocationRequestMessage,
  TextMessage,
} from './types.ts';

// Limits from the WhatsApp Cloud API reference for interactive messages.
export const LIMITS = {
  body: 1024,
  text: 4096,
  header: 60,
  footer: 60,
  buttons: 3,
  buttonTitle: 20,
  buttonId: 256,
  listButton: 20,
  listRows: 10,
  listSections: 10,
  sectionTitle: 24,
  rowTitle: 24,
  rowDescription: 72,
  ctaText: 20,
} as const;

/** Cuts a string to `max` characters (by code point, so emoji stay whole), ending with an ellipsis. */
export function fit(text: string, max: number): string {
  const chars = [...text];
  if (chars.length <= max) return text;
  return chars.slice(0, max - 1).join('').trimEnd() + '…';
}

export function text(body: string): TextMessage {
  return { type: 'text', text: { body: fit(body, LIMITS.text) } };
}

export interface ButtonOptions {
  header?: string;
  footer?: string;
}

/** Reply buttons. More than three is a programming error, not something to truncate silently. */
export function buttons(body: string, choices: Choice[], opts: ButtonOptions = {}): ButtonMessage {
  if (choices.length === 0 || choices.length > LIMITS.buttons) {
    throw new Error(`buttons(): need 1-${LIMITS.buttons} choices, got ${choices.length}`);
  }
  assertUniqueIds(choices.map((c) => c.id));
  return {
    type: 'interactive',
    interactive: {
      type: 'button',
      ...(opts.header && { header: { type: 'text', text: fit(opts.header, LIMITS.header) } }),
      body: { text: fit(body, LIMITS.body) },
      ...(opts.footer && { footer: { text: fit(opts.footer, LIMITS.footer) } }),
      action: {
        buttons: choices.map((c) => ({
          type: 'reply',
          reply: { id: c.id, title: fit(c.title, LIMITS.buttonTitle) },
        })),
      },
    },
  };
}

export interface ListOptions {
  header?: string;
  footer?: string;
}

/** List message. WhatsApp allows 10 rows in total across all sections. */
export function list(
  body: string,
  button: string,
  sections: ListSection[],
  opts: ListOptions = {},
): ListMessage {
  const rows = sections.flatMap((s) => s.rows);
  if (rows.length === 0 || rows.length > LIMITS.listRows) {
    throw new Error(`list(): need 1-${LIMITS.listRows} rows, got ${rows.length}`);
  }
  assertUniqueIds(rows.map((r) => r.id));
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      ...(opts.header && { header: { type: 'text', text: fit(opts.header, LIMITS.header) } }),
      body: { text: fit(body, LIMITS.body) },
      ...(opts.footer && { footer: { text: fit(opts.footer, LIMITS.footer) } }),
      action: {
        button: fit(button, LIMITS.listButton),
        sections: sections.map((s) => ({
          // Section titles are required once there is more than one section.
          ...(s.title && { title: fit(s.title, LIMITS.sectionTitle) }),
          rows: s.rows.map((r) => ({
            id: r.id,
            title: fit(r.title, LIMITS.rowTitle),
            ...(r.description && { description: fit(r.description, LIMITS.rowDescription) }),
          })),
        })),
      },
    },
  };
}

/**
 * Splits rows into pages that fit one list message. When there are more rows than fit,
 * the last row of each page except the final one becomes `more` (pointing at the next page).
 */
export function paginate<T extends Choice & { description?: string }>(
  rows: T[],
  page: number,
  more: (nextPage: number) => Choice,
): Array<T | Choice> {
  if (rows.length <= LIMITS.listRows) return rows;
  const perPage = LIMITS.listRows - 1;
  const start = page * perPage;
  const slice = rows.slice(start, start + perPage);
  const isLast = start + perPage >= rows.length;
  return isLast ? slice : [...slice, more(page + 1)];
}

export function ctaUrl(body: string, displayText: string, url: string): CtaUrlMessage {
  return {
    type: 'interactive',
    interactive: {
      type: 'cta_url',
      body: { text: fit(body, LIMITS.body) },
      action: { name: 'cta_url', parameters: { display_text: fit(displayText, LIMITS.ctaText), url } },
    },
  };
}

export function locationRequest(body: string): LocationRequestMessage {
  return {
    type: 'interactive',
    interactive: {
      type: 'location_request_message',
      body: { text: fit(body, LIMITS.body) },
      action: { name: 'send_location' },
    },
  };
}

function assertUniqueIds(ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (id.length > LIMITS.buttonId) throw new Error(`id too long: ${id}`);
    if (seen.has(id)) throw new Error(`duplicate id: ${id}`);
    seen.add(id);
  }
}
