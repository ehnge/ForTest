export type SolarEvent = {
  id: string;
  type: "CME" | "FLR" | "SEP";
  startedAt: string;
  summary: string;
};

export type SolarEventResult = {
  events: SolarEvent[];
  source: "nasa" | "mock";
  warning?: string;
};

type Cache = { expiresAt: number; result: SolarEventResult };
type Fetcher = typeof fetch;
type StorageLike = Pick<Storage, "getItem" | "setItem">;

const API_ROOT = "https://api.nasa.gov/DONKI";
const CACHE_KEY = "horizon:nasa-donki:cme:v1";
const CACHE_TTL_MS = 30 * 60 * 1000;
const DEMO_KEY = "DEMO_KEY";

const mockEvents: SolarEvent[] = [
  { id: "mock-cme-1", type: "CME", startedAt: "2026-06-29T12:00:00Z", summary: "Synthetic solar event for demonstration." },
];

export async function fetchRecentSolarEvents(options: {
  startDate?: string;
  endDate?: string;
  now?: number;
  fetcher?: Fetcher;
  storage?: StorageLike;
  apiKey?: string;
} = {}): Promise<SolarEventResult> {
  const now = options.now ?? Date.now();
  const storage = options.storage ?? (typeof localStorage === "undefined" ? undefined : localStorage);
  const cached = readCache(storage, now);
  if (cached) return cached;

  const end = options.endDate ?? isoDate(now);
  const start = options.startDate ?? isoDate(now - 7 * 86400000);
  const fetchImpl = options.fetcher ?? fetch;
  const url = `${API_ROOT}/CME?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}&api_key=${encodeURIComponent(options.apiKey ?? DEMO_KEY)}`;

  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`DONKI request failed with ${response.status}`);
    const payload: unknown = await response.json();
    const events = parseEvents(payload);
    const result: SolarEventResult = { events, source: "nasa" };
    writeCache(storage, now + CACHE_TTL_MS, result);
    return result;
  } catch {
    const result: SolarEventResult = {
      events: mockEvents,
      source: "mock",
      warning: "NASA solar events are unavailable or rate-limited; showing labeled demo data.",
    };
    writeCache(storage, now + 5 * 60 * 1000, result);
    return result;
  }
}

function parseEvents(payload: unknown): SolarEvent[] {
  if (!Array.isArray(payload)) return [];
  return payload.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const id = typeof row.activityID === "string" ? row.activityID : `nasa-cme-${index}`;
    const startedAt = typeof row.startTime === "string" ? row.startTime : "Unknown time";
    return [{ id, type: "CME" as const, startedAt, summary: "NASA DONKI solar event." }];
  });
}

function readCache(storage: StorageLike | undefined, now: number): SolarEventResult | null {
  if (!storage) return null;
  try {
    const cached = JSON.parse(storage.getItem(CACHE_KEY) ?? "null") as Cache | null;
    return cached && cached.expiresAt > now ? cached.result : null;
  } catch {
    return null;
  }
}

function writeCache(storage: StorageLike | undefined, expiresAt: number, result: SolarEventResult): void {
  try { storage?.setItem(CACHE_KEY, JSON.stringify({ expiresAt, result } satisfies Cache)); } catch { /* Storage is optional. */ }
}

function isoDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}
