import type { LoadStage, Place, RateconAnalysis, StopKind } from '../domain/types.ts';
import type { Lang } from '../i18n/index.ts';
import type { Config } from './config.ts';

// Thin client over Supabase's REST API (PostgREST), with the service role key.
// The bot keeps all state in Postgres, so the server itself can restart at any time.

export type OnboardingStep = 'language' | 'name' | 'company' | 'email' | 'disclaimer' | 'done';

export interface Driver {
  wa_id: string;
  lang: Lang | null;
  onboarding_step: OnboardingStep;
  name: string | null;
  company: string | null;
  email: string | null;
}

export interface Load {
  id: string;
  wa_id: string;
  load_number: string;
  broker: string | null;
  broker_email: string | null;
  pickup: Place | null;
  delivery: Place | null;
  rate_cents: number | null;
  miles: number | null;
  stage: LoadStage;
  detention_rate_cents: number;
  free_minutes: number;
  analysis: RateconAnalysis | null;
  created_at: string;
}

export interface Stop {
  id: string;
  load_id: string;
  kind: StopKind;
  place_name: string | null;
  lat: number | null;
  lng: number | null;
  time_zone: string;
  arrived_at: string;
  left_at: string | null;
}

export class Db {
  constructor(private readonly cfg: Config) {}

  private async rest<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
    const res = await fetch(`${this.cfg.supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: this.cfg.supabaseServiceKey,
        Authorization: `Bearer ${this.cfg.supabaseServiceKey}`,
        'Content-Type': 'application/json',
        ...(init.prefer && { Prefer: init.prefer }),
      },
    });
    if (!res.ok) throw new Error(`Supabase ${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`);
    const body = await res.text();
    return (body ? JSON.parse(body) : undefined) as T;
  }

  /** True the first time we see this message id; false for Meta's retries. */
  async claimMessage(wamid: string): Promise<boolean> {
    const rows = await this.rest<unknown[]>('processed_messages?on_conflict=wamid', {
      method: 'POST',
      body: JSON.stringify({ wamid }),
      prefer: 'resolution=ignore-duplicates,return=representation',
    });
    return rows.length > 0;
  }

  async getDriver(waId: string): Promise<Driver | undefined> {
    const rows = await this.rest<Driver[]>(`drivers?wa_id=eq.${enc(waId)}`);
    return rows[0];
  }

  async createDriver(waId: string): Promise<Driver> {
    const rows = await this.rest<Driver[]>('drivers', {
      method: 'POST',
      body: JSON.stringify({ wa_id: waId }),
      prefer: 'return=representation',
    });
    return rows[0]!;
  }

  async updateDriver(waId: string, patch: Partial<Omit<Driver, 'wa_id'>>): Promise<void> {
    await this.rest(`drivers?wa_id=eq.${enc(waId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    });
  }

  /** Deletes the driver; loads and stops go with them (on delete cascade). */
  async deleteDriver(waId: string): Promise<void> {
    await this.rest(`drivers?wa_id=eq.${enc(waId)}`, { method: 'DELETE' });
  }

  async recentLoads(waId: string, limit = 10): Promise<Load[]> {
    return this.rest<Load[]>(`loads?wa_id=eq.${enc(waId)}&order=created_at.desc&limit=${limit}`);
  }

  async getLoad(waId: string, loadNumber: string): Promise<Load | undefined> {
    const rows = await this.rest<Load[]>(
      `loads?wa_id=eq.${enc(waId)}&load_number=eq.${enc(loadNumber)}&order=created_at.desc&limit=1`,
    );
    return rows[0];
  }

  async createLoad(load: Pick<Load, 'wa_id' | 'load_number' | 'stage'> & Partial<Load>): Promise<Load> {
    const rows = await this.rest<Load[]>('loads', {
      method: 'POST',
      body: JSON.stringify(load),
      prefer: 'return=representation',
    });
    return rows[0]!;
  }

  async setLoadStage(loadId: string, stage: LoadStage): Promise<void> {
    await this.rest(`loads?id=eq.${enc(loadId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, updated_at: new Date().toISOString() }),
    });
  }

  async openStop(loadId: string): Promise<Stop | undefined> {
    const rows = await this.rest<Stop[]>(`stops?load_id=eq.${enc(loadId)}&left_at=is.null&order=arrived_at.desc&limit=1`);
    return rows[0];
  }

  async createStop(stop: Omit<Stop, 'id' | 'left_at'>): Promise<Stop> {
    const rows = await this.rest<Stop[]>('stops', {
      method: 'POST',
      body: JSON.stringify(stop),
      prefer: 'return=representation',
    });
    return rows[0]!;
  }

  async closeStop(stopId: string, leftAt: Date): Promise<void> {
    await this.rest(`stops?id=eq.${enc(stopId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ left_at: leftAt.toISOString() }),
    });
  }
}

const enc = encodeURIComponent;
