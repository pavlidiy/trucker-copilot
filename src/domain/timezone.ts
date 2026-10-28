// Rough US time zone from a longitude, good enough to print "08:12" the way the driver sees it
// on the dock clock. Arizona and zone borders can be off by an hour; a proper lookup can replace this.

export const DEFAULT_TIME_ZONE = 'America/Chicago';

export function timeZoneFor(lng: number | undefined): string {
  if (lng === undefined) return DEFAULT_TIME_ZONE;
  if (lng > -87.5) return 'America/New_York';
  if (lng > -101.5) return 'America/Chicago';
  if (lng > -114.5) return 'America/Denver';
  return 'America/Los_Angeles';
}
