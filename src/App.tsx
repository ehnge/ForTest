import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell, type ViewName } from "./components/AppShell";
import { GuidanceView, HomeView, ProfileView, TrendsView, WellbeingView } from "./components/WorkspaceViews";
import { createHorizonRepository } from "./data/repository";
import { createBackendDashboardRepository, type DashboardSource } from "./lib/backendDashboardRepository";
import { mockDashboardRepository } from "./lib/mockDashboardRepository";
import { supabase, supabaseConfigured } from "./lib/supabase";
import { usePersistedState } from "./lib/usePersistedState";
import type { DashboardSnapshot } from "./lib/dashboardRepository";
import type { LifeStage, SimulationScenario } from "./types/horizon";

export default function App() {
  const mockProfiles = mockDashboardRepository.getProfiles();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [activeView, setActiveView] = useState<ViewName>("home");
  const [stage, setStage] = usePersistedState<LifeStage>("horizon:life-stage", "active");
  const [scenario, setScenario] = usePersistedState<SimulationScenario>("horizon:scenario", "usual");
  const [seed, setSeed] = usePersistedState<number>("horizon:seed", 42);
  const [replayCount, setReplayCount] = usePersistedState<number>("horizon:replay-count", 0);
  const [profileId, setProfileId] = usePersistedState("horizon:profile", profiles[0].id);
  const [checkIn, setCheckIn] = usePersistedState("horizon:wellbeing", { mood: "", stress: "", sleepQuality: "", note: "" });
  const [privacy, setPrivacy] = usePersistedState("horizon:privacy", { mood: true, notes: false, trends: true });
  const [loading, setLoading] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendSnapshot, setBackendSnapshot] = useState<DashboardSnapshot | null>(null);
  const [dataSource, setDataSource] = useState<DashboardSource>("local");
  const [dataWarning, setDataWarning] = useState<string | undefined>();
  const loadingTimer = useRef<number | undefined>(undefined);

  const profile = profiles.find((candidate) => candidate.id === profileId) ?? profiles[0];
  const mockDashboard = useMemo(() => mockDashboardRepository.getSnapshot(scenario, { seed, replayCount }), [scenario, seed, replayCount]);
  const dashboard = scenario === "usual" && backendSnapshot ? backendSnapshot : mockDashboard;
  const dataQuality = scenario === "sensor_disconnected" ? "disconnected" : scenario === "offline" ? "offline" : scenario === "stale" ? "stale" : "current";
  const viewSource = scenario === "usual" ? dataSource : "local";
  const viewWarning = scenario === "usual" ? dataWarning : undefined;
  const viewLoading = loading || (scenario === "usual" && backendLoading);
  const backendRepository = useMemo(() => createBackendDashboardRepository(
    createHorizonRepository(supabaseConfigured && seed === 42 ? supabase : null, seed),
  ), [seed]);

  const setStageAndProfile = (nextStage: LifeStage) => {
    setStage(nextStage);
    const matchingProfile = profiles.find((candidate) => candidate.stage === nextStage);
    if (matchingProfile) setProfileId(matchingProfile.id);
  };

  useEffect(() => () => window.clearTimeout(loadingTimer.current), []);

  useEffect(() => {
    if (scenario !== "usual") {
      setBackendLoading(false);
      return;
    }
    let cancelled = false;
    setBackendLoading(true);
    void (async () => {
      try {
        const profileResult = await backendRepository.loadProfiles();
        if (cancelled) return;
        const nextProfiles = profileResult.data.length ? profileResult.data : mockProfiles;
        const nextProfileId = nextProfiles.some((candidate) => candidate.id === profileId) ? profileId : nextProfiles[0].id;
        setProfiles(nextProfiles);
        if (nextProfileId !== profileId) setProfileId(nextProfileId);
        const snapshotResult = await backendRepository.loadSnapshot(nextProfileId, { seed, replayCount });
        if (cancelled) return;
        setBackendSnapshot(snapshotResult.data);
        setDataSource(snapshotResult.source);
        setDataWarning([profileResult.warning, snapshotResult.warning].filter(Boolean).join(" ") || undefined);
      } catch {
        if (!cancelled) {
          setDataSource("local");
          setDataWarning("Backend data could not be loaded; using deterministic synthetic fallback.");
        }
      } finally {
        if (!cancelled) setBackendLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [backendRepository, mockProfiles, profileId, replayCount, scenario, seed, setProfileId]);

  const setScenarioWithLoading = (nextScenario: SimulationScenario) => {
    window.clearTimeout(loadingTimer.current);
    setLoading(true);
    setScenario(nextScenario);
    loadingTimer.current = window.setTimeout(() => setLoading(false), 180);
  };

  const setSeedWithLoading = (nextSeed: number) => {
    window.clearTimeout(loadingTimer.current);
    setLoading(true);
    setSeed(nextSeed);
    loadingTimer.current = window.setTimeout(() => setLoading(false), 180);
  };

  const replayEvents = () => {
    window.clearTimeout(loadingTimer.current);
    setLoading(true);
    setReplayCount((count) => count + 1);
    loadingTimer.current = window.setTimeout(() => setLoading(false), 180);
  };

  const content = (() => {
    switch (activeView) {
      case "trends":
        return <TrendsView metrics={dashboard.metrics} alert={dashboard.alert} dataQuality={dataQuality} loading={viewLoading} source={viewSource} warning={viewWarning} />;
      case "wellbeing":
        return <WellbeingView checkIn={checkIn} onCheckInChange={setCheckIn} privacy={privacy} onPrivacyChange={setPrivacy} />;
      case "guidance":
        return <GuidanceView stage={stage} />;
      case "profile":
        return <ProfileView profile={profile} profiles={profiles} stage={stage} scenario={scenario} seed={seed} replayCount={replayCount} loading={viewLoading} onProfileChange={setProfileId} onScenarioChange={setScenarioWithLoading} onSeedChange={setSeedWithLoading} onReplay={replayEvents} onStageChange={setStageAndProfile} />;
      case "home":
      default:
        return <HomeView profile={profile} stage={stage} scenario={scenario} metrics={dashboard.metrics} alert={dashboard.alert} dataQuality={dataQuality} loading={viewLoading} source={viewSource} warning={viewWarning} onViewChange={setActiveView} />;
    }
  })();

  return <AppShell activeView={activeView} onViewChange={setActiveView} stage={stage} onStageChange={setStageAndProfile}>{content}</AppShell>;
}
