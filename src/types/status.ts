export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export interface StatusHistoryEntry {
  jobId: string;
  status: JobStatus;
  changedAt: string; // ISO date string
}
