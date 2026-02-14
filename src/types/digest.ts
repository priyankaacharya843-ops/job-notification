export interface DigestEntry {
  jobId: string;
  matchScore: number;
}

export interface StoredDigest {
  date: string; // YYYY-MM-DD
  entries: DigestEntry[];
}

export function getDigestStorageKey(date: string): string {
  return `jobTrackerDigest_${date}`;
}
