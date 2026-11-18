import type { Demographics } from "./api";

export const KEYS = {
  name: "skinstric_name",
  location: "skinstric_location",
  demographics: "skinstric_demographics",
  selections: "skinstric_selections",
  image: "skinstric_image",
} as const;

export interface Selections {
  race?: string;
  age?: string;
  gender?: string;
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage full or blocked — app still works for this visit */
  }
}

export const storage = {
  getString: safeGet,
  setString: safeSet,
  getDemographics(): Demographics | null {
    const raw = safeGet(KEYS.demographics);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Demographics;
    } catch {
      return null;
    }
  },
  setDemographics(d: Demographics) {
    safeSet(KEYS.demographics, JSON.stringify(d));
    // New scan → clear any old manual corrections
    try {
      localStorage.removeItem(KEYS.selections);
    } catch {}
  },
  getSelections(): Selections {
    const raw = safeGet(KEYS.selections);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Selections;
    } catch {
      return {};
    }
  },
  setSelections(s: Selections) {
    safeSet(KEYS.selections, JSON.stringify(s));
  },
};
