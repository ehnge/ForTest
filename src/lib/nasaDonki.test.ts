import { describe, expect, it } from "vitest";
import { fetchRecentSolarEvents } from "./nasaDonki";

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
}

describe("NASA DONKI adapter", () => {
  it("normalizes NASA events and caches the response", async () => {
    const cache = storage();
    let requests = 0;
    const fetcher = async () => { requests += 1; return new Response(JSON.stringify([{ activityID: "cme-1", startTime: "2026-06-29T12:00:00Z" }])); };
    const first = await fetchRecentSolarEvents({ now: Date.parse("2026-06-30T00:00:00Z"), fetcher: fetcher as typeof fetch, storage: cache });
    const second = await fetchRecentSolarEvents({ now: Date.parse("2026-06-30T00:05:00Z"), fetcher: fetcher as typeof fetch, storage: cache });

    expect(first).toMatchObject({ source: "nasa", events: [{ id: "cme-1", type: "CME" }] });
    expect(second).toEqual(first);
    expect(requests).toBe(1);
  });

  it("falls back to labeled demo data when NASA is unavailable", async () => {
    const result = await fetchRecentSolarEvents({ fetcher: (async () => new Response("", { status: 429 })) as typeof fetch, storage: storage() });

    expect(result.source).toBe("mock");
    expect(result.warning).toMatch(/rate-limited/);
    expect(result.events[0].summary).toMatch(/Synthetic/);
  });
});
