// Rate con reading with Muse Spark (Meta Model API, OpenAI-compatible Chat Completions).
// The model only extracts what the document says, with quotes and page numbers.
// Judging what is risky happens in code (domain/risks.ts), so every language gets the same verdict.

export interface MuseConfig {
  apiKey: string;
  model: string; // e.g. "muse-spark-1.3"
  baseUrl?: string;
}

export interface Clause {
  present: boolean;
  amount_usd: number | null;
  quote: string | null; // exact words from the document
  page: number | null;
}

export interface RateconExtract {
  is_rate_confirmation: boolean;
  load_number: string | null;
  broker_name: string | null;
  broker_email: string | null;
  pickup: Stop;
  delivery: Stop;
  rate_usd: number | null;
  miles: number | null;
  detention: Clause & { free_hours: number | null };
  late_fee: Clause;
  tonu: Clause;
  lumper: { paid_by: 'driver' | 'carrier' | 'broker' | 'shipper' | 'unknown'; reimbursed: boolean | null; quote: string | null; page: number | null };
}

interface Stop {
  facility_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  appointment: string | null; // as written, e.g. "11/02 08:00"
}

export interface DocumentPart {
  mime: string; // image/jpeg, application/pdf, ...
  data: Uint8Array;
  filename?: string;
}

const nullable = (type: string) => ({ type: [type, 'null'] });

const stopSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['facility_name', 'address', 'city', 'state', 'appointment'],
  properties: {
    facility_name: nullable('string'),
    address: nullable('string'),
    city: nullable('string'),
    state: { ...nullable('string'), description: '2-letter US state' },
    appointment: { ...nullable('string'), description: 'Appointment date/time exactly as written' },
  },
};

const clause = (extra: Record<string, unknown> = {}) => ({
  type: 'object',
  additionalProperties: false,
  required: ['present', 'amount_usd', 'quote', 'page', ...Object.keys(extra)],
  properties: {
    present: { type: 'boolean' },
    amount_usd: { ...nullable('number'), description: 'Dollar amount; per hour for detention' },
    quote: { ...nullable('string'), description: 'The exact sentence from the document, verbatim' },
    page: { ...nullable('integer'), description: '1-based page number where the quote is' },
    ...extra,
  },
});

export const RATECON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'is_rate_confirmation', 'load_number', 'broker_name', 'broker_email', 'pickup', 'delivery',
    'rate_usd', 'miles', 'detention', 'late_fee', 'tonu', 'lumper',
  ],
  properties: {
    is_rate_confirmation: { type: 'boolean', description: 'False if this is not a rate confirmation (e.g. a BOL or a selfie)' },
    load_number: { ...nullable('string'), description: 'Load / order / reference number' },
    broker_name: nullable('string'),
    broker_email: { ...nullable('string'), description: 'Dispatch or accounting email of the broker' },
    pickup: stopSchema,
    delivery: stopSchema,
    rate_usd: { ...nullable('number'), description: 'Total line-haul rate to the carrier, all-in' },
    miles: { ...nullable('number'), description: 'Loaded miles if stated' },
    detention: clause({ free_hours: { ...nullable('number'), description: 'Free hours before detention starts' } }),
    late_fee: clause(),
    tonu: clause(),
    lumper: {
      type: 'object',
      additionalProperties: false,
      required: ['paid_by', 'reimbursed', 'quote', 'page'],
      properties: {
        paid_by: { type: 'string', enum: ['driver', 'carrier', 'broker', 'shipper', 'unknown'] },
        reimbursed: nullable('boolean'),
        quote: nullable('string'),
        page: nullable('integer'),
      },
    },
  },
};

const INSTRUCTIONS = `You read US trucking rate confirmations for drivers.
Extract only what the document states. Never guess: use null when a value is not written.
For each clause (detention, late fee, TONU, lumper) copy the exact sentence into "quote" and give its page.
"present" is true only if the document has a clause about it. For detention, amount_usd is the guaranteed hourly
rate; use null when pay is only "if approved", "at broker's discretion" or "none". Fines for being late, missing appointments or
service failures count as late_fee. Lumper paid by driver or carrier "with receipt" means paid_by "carrier",
reimbursed true.`;

export async function readRatecon(cfg: MuseConfig, parts: DocumentPart[]): Promise<RateconExtract> {
  const content: unknown[] = [{ type: 'text', text: 'Extract this rate confirmation.' }];
  for (const p of parts) {
    const dataUrl = `data:${p.mime};base64,${Buffer.from(p.data).toString('base64')}`;
    content.push(
      p.mime === 'application/pdf'
        ? { type: 'file', file: { filename: p.filename ?? 'ratecon.pdf', file_data: dataUrl } }
        : { type: 'image_url', image_url: { url: dataUrl } },
    );
  }

  const res = await fetch(`${cfg.baseUrl ?? 'https://api.meta.ai/v1'}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'developer', content: INSTRUCTIONS },
        { role: 'user', content },
      ],
      reasoning_effort: 'low',
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'RateConfirmation', schema: RATECON_SCHEMA, strict: true },
      },
    }),
  });
  if (!res.ok) throw new Error(`Muse Spark ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return JSON.parse(body.choices[0]!.message.content) as RateconExtract;
}
