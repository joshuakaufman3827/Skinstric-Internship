const BASE = "https://us-central1-frontend-simplified.cloudfunctions.net";

export type Scores = Record<string, number>;

export interface Demographics {
  race: Scores;
  age: Scores;
  gender: Scores;
}

export interface PhaseTwoResponse {
  message: string;
  data: Demographics;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}) ${text}`.trim());
  }
  return res.json() as Promise<T>;
}

/** Phase 1 — send the user's name and location. */
export function submitUserInfo(name: string, location: string) {
  return post<Record<string, string>>("skinstricPhaseOne", { name, location });
}

/** Phase 2 & 3 — send a base64 image (no "data:image/...;base64," prefix). */
export function submitImage(base64: string) {
  return post<PhaseTwoResponse>("skinstricPhaseTwo", { image: base64 });
}
