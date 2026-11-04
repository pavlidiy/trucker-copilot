// Outgoing message shapes for the WhatsApp Cloud API (POST /{phone-number-id}/messages).
// Only the parts we render are modelled; `to` and `messaging_product` are added by the sender.

export interface TextMessage {
  type: 'text';
  text: { body: string; preview_url?: boolean };
}

export interface ReplyButton {
  type: 'reply';
  reply: { id: string; title: string };
}

export interface ButtonMessage {
  type: 'interactive';
  interactive: {
    type: 'button';
    header?: { type: 'text'; text: string };
    body: { text: string };
    footer?: { text: string };
    action: { buttons: ReplyButton[] };
  };
}

export interface ListRow {
  id: string;
  title: string;
  description?: string;
}

export interface ListSection {
  title?: string;
  rows: ListRow[];
}

export interface ListMessage {
  type: 'interactive';
  interactive: {
    type: 'list';
    header?: { type: 'text'; text: string };
    body: { text: string };
    footer?: { text: string };
    action: { button: string; sections: ListSection[] };
  };
}

export interface CtaUrlMessage {
  type: 'interactive';
  interactive: {
    type: 'cta_url';
    body: { text: string };
    footer?: { text: string };
    action: { name: 'cta_url'; parameters: { display_text: string; url: string } };
  };
}

export interface LocationRequestMessage {
  type: 'interactive';
  interactive: {
    type: 'location_request_message';
    body: { text: string };
    action: { name: 'send_location' };
  };
}

export type OutgoingMessage =
  | TextMessage
  | ButtonMessage
  | ListMessage
  | CtaUrlMessage
  | LocationRequestMessage;

// Something the driver pressed or chose. Every button and list row id is one of these.
export interface Choice {
  id: string;
  title: string;
}
