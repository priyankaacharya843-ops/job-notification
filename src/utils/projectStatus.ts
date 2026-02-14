import { allTestsPassed } from "./testChecklist";
import { allArtifactsProvided } from "./proofArtifacts";

export type ProjectStatus = "Not Started" | "In Progress" | "Shipped";

export function getProjectStatus(): ProjectStatus {
  const testsPassed = allTestsPassed();
  const artifactsComplete = allArtifactsProvided();

  if (testsPassed && artifactsComplete) return "Shipped";
  if (testsPassed || artifactsComplete) return "In Progress";
  return "Not Started";
}

export function canMarkShipped(): boolean {
  return allTestsPassed() && allArtifactsProvided();
}
