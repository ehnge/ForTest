import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdaptationDayProgress, BaselineCheckIn, LifeStage, PreparationSession, PrivacyPreferences, TravelerPreferences } from "../types/horizon";

export type PreparationRepository = ReturnType<typeof createPreparationRepository>;
type Result<T> = { data: T; warning?: string };
const unavailable = <T>(data: T): Result<T> => ({ data, warning: "Cloud save unavailable; this demo session will not persist remotely." });

export function createPreparationRepository(client: SupabaseClient | null, userId: string | null) {
  const ready = Boolean(client && userId);
  const call = async <T>(operation: () => PromiseLike<{ data: T | null; error: { message: string } | null }>, fallback: T): Promise<Result<T>> => {
    if (!ready) return unavailable(fallback);
    const { data, error } = await operation();
    if (error || data === null) return { data: fallback, warning: error?.message ?? "Cloud save failed." };
    return { data };
  };
  return {
    async getTravelerPreferences(): Promise<Result<TravelerPreferences | null>> {
      return call(() => client!.from("traveler_preferences").select("user_id,stage,profile_id").eq("user_id", userId!).maybeSingle().then(({ data, error }) => ({ data: data ? { userId: data.user_id, stage: data.stage, profileId: data.profile_id } : null, error })), null);
    },
    async saveTravelerPreferences(stage: LifeStage, profileId: string): Promise<Result<TravelerPreferences | null>> {
      return call(() => client!.from("traveler_preferences").upsert({ user_id: userId, stage, profile_id: profileId }, { onConflict: "user_id" }).select("user_id,stage,profile_id").single().then(({ data, error }) => ({ data: data ? { userId: data.user_id, stage: data.stage, profileId: data.profile_id } : null, error })), null);
    },
    async listBaselineCheckins(): Promise<Result<BaselineCheckIn[]>> {
      return call(() => client!.from("baseline_checkins").select("id,check_in_date,resting_heart_rate,sleep_hours,sleep_quality,mood,stress,exercise_completed,note").eq("user_id", userId!).order("check_in_date", { ascending: false }).then(({ data, error }) => ({ data: (data ?? []).map((row) => ({ id: row.id, checkInDate: row.check_in_date, restingHeartRate: row.resting_heart_rate, sleepHours: row.sleep_hours, sleepQuality: row.sleep_quality, mood: row.mood, stress: row.stress, exerciseCompleted: row.exercise_completed, note: row.note })), error })), []);
    },
    async saveBaselineCheckin(checkIn: BaselineCheckIn): Promise<Result<BaselineCheckIn | null>> {
      return call(() => client!.from("baseline_checkins").upsert({ user_id: userId, check_in_date: checkIn.checkInDate, resting_heart_rate: checkIn.restingHeartRate ?? null, sleep_hours: checkIn.sleepHours ?? null, sleep_quality: checkIn.sleepQuality ?? null, mood: checkIn.mood ?? null, stress: checkIn.stress ?? null, exercise_completed: checkIn.exerciseCompleted, note: checkIn.note, is_synthetic: true }, { onConflict: "user_id,check_in_date" }).select("id,check_in_date,resting_heart_rate,sleep_hours,sleep_quality,mood,stress,exercise_completed,note").single().then(({ data, error }) => ({ data: data ? { id: data.id, checkInDate: data.check_in_date, restingHeartRate: data.resting_heart_rate, sleepHours: data.sleep_hours, sleepQuality: data.sleep_quality, mood: data.mood, stress: data.stress, exerciseCompleted: data.exercise_completed, note: data.note } : null, error })), null);
    },
    async listPreparationSessions(): Promise<Result<PreparationSession[]>> {
      return call(() => client!.from("preparation_sessions").select("id,session_id,session_type,status,completed_at").eq("user_id", userId!).then(({ data, error }) => ({ data: (data ?? []).map((row) => ({ id: row.id, sessionId: row.session_id, type: row.session_type, status: row.status, completedAt: row.completed_at ?? undefined })), error })), []);
    },
    async savePreparationSession(session: PreparationSession): Promise<Result<PreparationSession | null>> {
      return call(() => client!.from("preparation_sessions").upsert({ user_id: userId, session_id: session.sessionId, session_type: session.type, status: session.status, completed_at: session.completedAt ?? new Date().toISOString(), is_synthetic: true }, { onConflict: "user_id,session_id" }).select("id,session_id,session_type,status,completed_at").single().then(({ data, error }) => ({ data: data ? { id: data.id, sessionId: data.session_id, type: data.session_type, status: data.status, completedAt: data.completed_at } : null, error })), null);
    },
    async getAdaptationProgress(): Promise<Result<AdaptationDayProgress[]>> {
      return call(() => client!.from("adaptation_progress").select("day,completed,experience_note").eq("user_id", userId!).order("day").then(({ data, error }) => ({ data: (data ?? []).map((row) => ({ day: row.day, completed: row.completed, experienceNote: row.experience_note ?? "" })), error })), []);
    },
    async saveAdaptationProgress(progress: AdaptationDayProgress): Promise<Result<AdaptationDayProgress | null>> {
      return call(() => client!.from("adaptation_progress").upsert({ user_id: userId, day: progress.day, completed: progress.completed, experience_note: progress.experienceNote, is_synthetic: true }, { onConflict: "user_id,day" }).select("day,completed,experience_note").single().then(({ data, error }) => ({ data: data ? { day: data.day, completed: data.completed, experienceNote: data.experience_note ?? "" } : null, error })), null);
    },
    async getPrivacyPreferences(): Promise<Result<PrivacyPreferences | null>> {
      return call(() => client!.from("privacy_preferences").select("mood,notes,trends").eq("user_id", userId!).maybeSingle().then(({ data, error }) => ({ data: data ? { mood: data.mood, notes: data.notes, trends: data.trends } : null, error })), null);
    },
    async savePrivacyPreferences(preferences: PrivacyPreferences): Promise<Result<PrivacyPreferences | null>> {
      return call(() => client!.from("privacy_preferences").upsert({ user_id: userId, mood: preferences.mood, notes: preferences.notes, trends: preferences.trends }, { onConflict: "user_id" }).select("mood,notes,trends").single().then(({ data, error }) => ({ data: data ? { mood: data.mood, notes: data.notes, trends: data.trends } : null, error })), null);
    },
  };
}
