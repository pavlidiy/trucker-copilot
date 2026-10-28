// Everything secret comes from the environment (.env on the server, never the repo).

export interface Config {
  port: number;
  /** System user token for the WhatsApp Cloud API. */
  waToken: string;
  /** Phone Number ID of the bot's number (not the number itself). */
  phoneNumberId: string;
  /** App secret, to check X-Hub-Signature-256 on webhooks. */
  appSecret: string;
  /** Any string; the same one is typed into the Meta webhook settings. */
  verifyToken: string;
  graphVersion: string;
  supabaseUrl: string;
  supabaseServiceKey: string;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const need = (name: string): string => {
    const value = env[name];
    if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
    return value;
  };
  return {
    port: Number(env.PORT ?? 8787),
    waToken: need('WA_TOKEN'),
    phoneNumberId: need('WA_PHONE_NUMBER_ID'),
    appSecret: need('META_APP_SECRET'),
    verifyToken: need('WA_VERIFY_TOKEN'),
    graphVersion: env.GRAPH_VERSION ?? 'v23.0',
    supabaseUrl: need('SUPABASE_URL'),
    supabaseServiceKey: need('SUPABASE_SERVICE_ROLE_KEY'),
  };
}
