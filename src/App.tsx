import { useMemo, useState } from "react";
import { AppShell, type ViewName } from "./components/AppShell";
import { GuidanceView, HomeView, ProfileView, TrendsView, WellbeingView } from "./components/WorkspaceViews";
import { getScenarioData, profiles } from "./lib/mockDashboardData";
import { usePersistedState } from "./lib/usePersistedState";
import type { LifeStage, SimulationScenario } from "./types/horizon";

export default function App() {
  const [activeView, setActiveView] = useState<ViewName>("home");
  const [stage, setStage] = usePersistedState<LifeStage>("horizon:life-stage", "active");
  const [scenario, setScenario] = usePersistedState<SimulationScenario>("horizon:scenario", "usual");
  const [profileId, setProfileId] = usePersistedState("horizon:profile", profiles[0].id);
  const [checkIn, setCheckIn] = usePersistedState("horizon:wellbeing", { mood: "", stress: "", sleepQuality: "", note: "" });
  const [privacy, setPrivacy] = usePersistedState("horizon:privacy", { mood: true, notes: false, trends: true });

  const profile = profiles.find((candidate) => candidate.id === profileId) ?? profiles[0];
  const dashboard = useMemo(() => getScenarioData(scenario), [scenario]);
  const dataQuality = scenario === "sensor_disconnected" ? "disconnected" : scenario === "offline" ? "offline" : scenario === "stale" ? "stale" : "current";

  const setStageAndProfile = (nextStage: LifeStage) => {
    setStage(nextStage);
    const matchingProfile = profiles.find((candidate) => candidate.stage === nextStage);
    if (matchingProfile) setProfileId(matchingProfile.id);
  };

  const content = (() => {
    switch (activeView) {
      case "trends":
        return <TrendsView metrics={dashboard.metrics} dataQuality={dataQuality} />;
      case "wellbeing":
        return <WellbeingView checkIn={checkIn} onCheckInChange={setCheckIn} privacy={privacy} onPrivacyChange={setPrivacy} />;
      case "guidance":
        return <GuidanceView stage={stage} />;
      case "profile":
        return <ProfileView profile={profile} profiles={profiles} stage={stage} scenario={scenario} onProfileChange={setProfileId} onScenarioChange={setScenario} onStageChange={setStageAndProfile} />;
      case "home":
      default:
        return <HomeView profile={profile} stage={stage} scenario={scenario} metrics={dashboard.metrics} alert={dashboard.alert} dataQuality={dataQuality} onViewChange={setActiveView} />;
    }
  })();

  return <AppShell activeView={activeView} onViewChange={setActiveView} stage={stage} onStageChange={setStageAndProfile}>{content}</AppShell>;
}
