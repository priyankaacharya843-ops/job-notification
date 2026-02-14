const STORAGE_KEY = "jobTrackerProof";

export interface ProofArtifacts {
  lovableLink: string;
  githubLink: string;
  deployedUrl: string;
}

const DEFAULT: ProofArtifacts = {
  lovableLink: "",
  githubLink: "",
  deployedUrl: "",
};

const URL_REGEX = /^https?:\/\/[^\s]+$/i;

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  return URL_REGEX.test(value.trim());
}

export function getProofArtifacts(): ProofArtifacts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT };
    return {
      lovableLink: typeof (parsed as ProofArtifacts).lovableLink === "string" ? (parsed as ProofArtifacts).lovableLink : "",
      githubLink: typeof (parsed as ProofArtifacts).githubLink === "string" ? (parsed as ProofArtifacts).githubLink : "",
      deployedUrl: typeof (parsed as ProofArtifacts).deployedUrl === "string" ? (parsed as ProofArtifacts).deployedUrl : "",
    };
  } catch {
    return { ...DEFAULT };
  }
}

export function setProofArtifacts(artifacts: Partial<ProofArtifacts>): void {
  const current = getProofArtifacts();
  const next = { ...current, ...artifacts };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function allArtifactsProvided(): boolean {
  const a = getProofArtifacts();
  return isValidUrl(a.lovableLink) && isValidUrl(a.githubLink) && isValidUrl(a.deployedUrl);
}
