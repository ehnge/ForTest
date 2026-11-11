import type { SupabaseClient } from '@supabase/supabase-js';
import { generateSyntheticData, validateSeed, DEFAULT_SEED } from './synthetic';
import { metricUnits } from '../domain/types';
import type { DataQualityState, DemoEvent, HorizonRepository, Observation, RepositoryResult, SimulationControls, Traveler } from '../domain/types';

function synthetic(row: unknown): row is Record<string, unknown> {
  return !!row && typeof row === 'object' && (row as Record<string, unknown>).is_synthetic === true;
}
export function isTraveler(row: unknown): row is Traveler {
  return synthetic(row) && typeof row.id === 'string' && typeof row.name === 'string'
    && ['future', 'active', 'retired'].includes(String(row.life_stage))
    && Number.isInteger(row.mission_day) && Number(row.mission_day) >= 0;
}
export function isObservation(row: unknown): row is Observation {
  return synthetic(row) && typeof row.id === 'string' && typeof row.person_id === 'string'
    && isDate(row.observed_on) && Object.hasOwn(metricUnits, String(row.metric))
    && row.unit === metricUnits[row.metric as keyof typeof metricUnits]
    && typeof row.value === 'number' && Number.isFinite(row.value)
    && row.value >= ({heart_rate:20,hrv:0,sleep_hours:0,skin_temperature:20,spo2:0,radiation_dose:0}[row.metric as keyof typeof metricUnits])
    && row.value <= ({heart_rate:250,hrv:300,sleep_hours:24,skin_temperature:45,spo2:100,radiation_dose:100}[row.metric as keyof typeof metricUnits])
    && ['rest', 'exercise'].includes(String(row.context)) && validSeed(row.seed);
}
export function isEvent(row: unknown): row is DemoEvent {
  return synthetic(row) && typeof row.id === 'string' && typeof row.person_id === 'string'
    && ['radiation_spike', 'illness_like', 'sleep_disruption'].includes(String(row.kind))
    && isDate(row.starts_on) && isDate(row.ends_on) && String(row.ends_on) >= String(row.starts_on)
    && typeof row.description === 'string' && validSeed(row.seed);
}
function validSeed(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 1_000_000;
}
function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

/** Read-only contract. Cloud failures are explicit; local data is never uploaded by this module. */
export function createHorizonRepository(client: SupabaseClient | null, seed = DEFAULT_SEED): HorizonRepository {
  validateSeed(seed);
  const local = generateSyntheticData(seed);
  async function read<T>(table: string, guard: (row: unknown) => row is T, fallback: () => T[],
    filters: Record<string, string | number> = {}, range?: { from?: string; to?: string }, controls?: SimulationControls): Promise<RepositoryResult<T[]>> {
    const quality = controls ? qualityFor(controls, fallback().length) : undefined;
    if (!client || controls?.scenario === 'offline' || controls?.replayCount) {
      return { data: fallback(), source: 'local', quality, warning: controls?.replayCount
        ? 'Replay uses deterministic local synthetic data.'
        : controls?.scenario === 'offline' ? 'Offline simulation is using deterministic local data.' : 'Supabase is not configured; using synthetic fallback.' };
    }
    try {
      const rows: T[] = [];
      // Supabase caps response sizes. Stable ID ordering prevents lost rows between pages.
      for (let offset = 0; ; offset += 500) {
        let query = client.from(table).select('*').eq('is_synthetic', true).order('id').range(offset, offset + 499);
        for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
        if (range?.from) query = query.gte('observed_on', range.from);
        if (range?.to) query = query.lte('observed_on', range.to);
        const { data, error } = await query.abortSignal(AbortSignal.timeout(15000));
        if (error || !data || !data.every(guard)) throw new Error('Cloud read failed validation.');
        rows.push(...data);
        if (data.length < 500) break;
      }
      // Empty results are valid; do not invent data for unknown travelers or empty date ranges.
      return { data: rows, source: 'supabase', quality };
    } catch {
      return { data: fallback(), source: 'local', quality, warning: 'Cloud data unavailable or invalid; using deterministic synthetic fallback.' };
    }
  }
  return {
    listPeople: () => read('sample_people', isTraveler, () => local.people),
    listObservations(personId, options = {}) {
      if ((options.from && !isDate(options.from)) || (options.to && !isDate(options.to))
        || (options.from && options.to && options.from > options.to)) throw new Error('Invalid observation date range.');
      return read('health_observations', isObservation, () => local.observations.filter(o => o.person_id === personId
        && (!options.from || o.observed_on >= options.from) && (!options.to || o.observed_on <= options.to)
        && options.controls?.scenario !== 'sensor-disconnected'),
      { person_id: personId, seed }, options, options.controls);
    },
    listEvents: (personId, options = {}) => read('demo_events', isEvent, () => local.events.filter(e => e.person_id === personId), { person_id: personId, seed }, undefined, options.controls),
  };
}

function qualityFor(controls: SimulationControls, observationCount: number): DataQualityState {
  if (controls.scenario === 'offline') return 'offline';
  if (controls.scenario === 'stale') return 'stale-data';
  if (controls.scenario === 'sensor-disconnected') return 'missing-data';
  return observationCount < 30 ? 'insufficient-baseline' : 'ready';
}
