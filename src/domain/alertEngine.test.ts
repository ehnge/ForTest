import { describe, expect, it } from "vitest";
import { evaluateAlerts } from "./alertEngine";
import type { Observation } from "./types";

describe("synthetic alert engine", () => {
  it("fires a single-reading alert with a plain-language reason", () => {
    const observations = makeSeries(30, 62).concat(makeObservation("2026-01-31", 80));
    const [alert] = evaluateAlerts(observations);

    expect(alert).toMatchObject({ rule: "single-reading", metric: "heart_rate", observed_on: "2026-01-31" });
    expect(alert.explanation).toContain("Resting heart rate");
    expect(alert.explanation).toContain("2026-01-31");
  });

  it("fires a sustained-shift alert when three of five readings move", () => {
    const baseline = makeSeries(30, 62);
    const shifted = [70, 70, 62, 70, 62].map((value, index) => makeObservation(`2026-02-${String(index + 1).padStart(2, "0")}`, value));
    const [alert] = evaluateAlerts(baseline.concat(shifted));

    expect(alert.rule).toBe("sustained-shift");
    expect(alert.explanation).toContain("3 of the last 5 days");
  });

  it("ignores exercise heart-rate readings", () => {
    const observations = makeSeries(30, 62).concat({ ...makeObservation("2026-01-31", 110), context: "exercise" });
    expect(evaluateAlerts(observations)).toHaveLength(0);
  });
});

function makeSeries(count: number, value: number): Observation[] {
  return Array.from({ length: count }, (_, index) => makeObservation(`2026-01-${String(index + 1).padStart(2, "0")}`, value));
}

function makeObservation(observed_on: string, value: number): Observation {
  return { id: `observation-${observed_on}`, person_id: "traveler-01", observed_on, metric: "heart_rate", value, unit: "bpm", context: "rest", seed: 42, is_synthetic: true };
}
