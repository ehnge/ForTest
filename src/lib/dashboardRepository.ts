import type { Alert, MetricCardData, SimulationControls, SimulationScenario, TravelerProfile } from "../types/horizon";

export interface DashboardSnapshot {
  metrics: MetricCardData[];
  alert: Alert | null;
}

/**
 * UI-facing data boundary. A Supabase-backed implementation can replace the
 * mock adapter without requiring views to know how records are fetched.
 */
export interface DashboardRepository {
  getProfiles(): TravelerProfile[];
  getSnapshot(scenario: SimulationScenario, controls: SimulationControls): DashboardSnapshot;
}
