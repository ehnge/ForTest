import { getScenarioData, profiles } from "./mockDashboardData";
import type { DashboardRepository } from "./dashboardRepository";

export const mockDashboardRepository: DashboardRepository = {
  getProfiles: () => profiles,
  getSnapshot: (scenario, controls) => getScenarioData(scenario, controls),
};
