// Shapes the screens render. The rate con analysis comes from Muse Spark structured output;
// risk codes are fixed here so every language gets the same wording from the string tables.

export type RiskLevel = 'red' | 'yellow' | 'green';

export type RiskCode =
  | 'no_detention_clause'
  | 'late_fine'
  | 'lumper_on_driver'
  | 'low_rpm'
  | 'tonu_missing'
  | 'good_rate';

export interface Risk {
  level: RiskLevel;
  code: RiskCode;
  amountCents?: number;
  /** Where in the document it was found, e.g. "p. 2, §7". Shown so the driver can check it. */
  ref?: string;
}

export interface Place {
  name: string;
  city: string;
}

export interface FacilityReputation {
  rating?: number; // Google rating, 1-5
  reviewQuote?: string; // short paraphrase of what drivers complain about
  avgWaitMinutes?: number; // from our own arrive/leave logs
  mapsUrl?: string;
  slow: boolean;
}

export interface RateconAnalysis {
  loadNumber: string;
  broker: string;
  brokerEmail?: string;
  pickup: Place;
  delivery: Place;
  rateCents: number;
  miles: number;
  risks: Risk[];
  pickupReputation?: FacilityReputation;
}

export type StopKind = 'pickup' | 'delivery';

/** Where the driver is in a load. The context buttons follow this. */
export type LoadStage =
  | 'checked' // rate con read, not booked yet
  | 'booked'
  | 'at_pickup'
  | 'left_pickup'
  | 'at_delivery'
  | 'left_delivery'
  | 'claim_sent'
  | 'closed';

export interface LoadSummary {
  loadNumber: string;
  pickup: Place;
  delivery: Place;
  stage: LoadStage;
  detentionCents: number;
}

export interface BrokerReply {
  summary: string; // in the driver's language
  meaning: string; // what it means for them, in the driver's language
  offeredCents?: number;
}
