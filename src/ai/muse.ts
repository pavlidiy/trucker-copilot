// One call shape for every Muse Spark task: instructions + content parts in, strict JSON out.
// Meta Model API is OpenAI-compatible Chat Completions.

export interface MuseConfig {
  apiKey: string;
  model: string; // e.g. "muse-spark-1.3"
  baseUrl?: string;
}

export interface DocumentPart {
  mime: string; // image/jpeg, application/pdf, ...
  data: Uint8Array;
  filename?: string;
}

export type Effort = 'minimal' | 'low' | 'medium' | 'high';

export async function museJson<T>(
  cfg: MuseConfig,
  task: { name: string; instructions: string; text: string; parts?: DocumentPart[]; schema: object; effort?: Effort },
): Promise<T> {
  const content: unknown[] = [{ type: 'text', text: task.text }];
  for (const p of task.parts ?? []) {
    const dataUrl = `data:${p.mime};base64,${Buffer.from(p.data).toString('base64')}`;
    content.push(
      p.mime === 'application/pdf'
        ? { type: 'file', file: { filename: p.filename ?? 'document.pdf', file_data: dataUrl } }
        : { type: 'image_url', image_url: { url: dataUrl } },
    );
  }

  const res = await fetch(`${cfg.baseUrl ?? 'https://api.meta.ai/v1'}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'developer', content: task.instructions },
        { role: 'user', content },
      ],
      reasoning_effort: task.effort ?? 'low',
      response_format: { type: 'json_schema', json_schema: { name: task.name, schema: task.schema, strict: true } },
    }),
  });
  if (!res.ok) throw new Error(`Muse Spark ${task.name} ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { choices: Array<{ message: { content: string } }> };
  return JSON.parse(body.choices[0]!.message.content) as T;
}

export const nullable = (type: string) => ({ type: [type, 'null'] });

/** A strict object schema: every property required, nothing extra (what strict mode accepts). */
export function object(properties: Record<string, unknown>): object {
  return { type: 'object', additionalProperties: false, required: Object.keys(properties), properties };
}
