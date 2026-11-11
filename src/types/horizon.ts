export type LifeStage = "future" | "active" | "retired";
export type MetricName = "resting_hr" | "hrv" | "spo2" | "sleep_hours" | "core_temperature" | "radiation_dose";
export type SimulationScenario = "usual" | "recovery_concern" | "sensor_disconnected" | "stale" | "offline";
export type DataQualityState = "current" | "stale" | "disconnected" | "offline" | "insufficient_baseline";
export type AlertSeverity = "normal" | "watch" | "talk_to_crew_medic";

export interface MetricPoint { day: string; value: number; baseline: number; alert?: boolean; }
export interface MetricCardData { metric: MetricName; label: string; unit: string; value: number; baseline: number; trend: "up" | "down" | "steady"; plainLanguage: string; points: MetricPoint[]; }
export interface Alert { id: string; severity: AlertSeverity; metric: MetricName; reason: string; nextAction: string; }
export interface TravelerProfile { id: string; name: string; role: string; missionDay: number; stage: LifeStage; }
