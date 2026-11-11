import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { createHorizonRepository } from '../src/data/repository.ts';
import { generateSyntheticData } from '../src/data/synthetic.ts';
const env = Object.fromEntries((await readFile('.env.local', 'utf8')).split(/\r?\n/)
  .filter(l => /^\s*VITE_SUPABASE_(URL|PUBLISHABLE_KEY)\s*=/.test(l))
  .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^(['"])(.*)\1$/, '$2')]; }));
assert.equal(env.VITE_SUPABASE_URL, 'https://chfvsmbsgdwauqbwnamv.supabase.co');
assert.ok(env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_publishable_'));
const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) },
});
const repo = createHorizonRepository(client);
const fixture = generateSyntheticData();
const people = await repo.listPeople();
assert.equal(people.source, 'supabase');
assert.deepEqual(people.data, fixture.people);
for (const person of fixture.people) {
  const actual = await repo.listObservations(person.id);
  assert.equal(actual.source, 'supabase');
  const expected = fixture.observations.filter(o => o.person_id === person.id);
  assert.equal(actual.data.length, expected.length);
  const byId = new Map(actual.data.map(o => [o.id, o]));
  for (const row of expected) assert.deepEqual(byId.get(row.id), row);
  const events = await repo.listEvents(person.id);
  assert.equal(events.source, 'supabase');
  assert.deepEqual(events.data, fixture.events.filter(e => e.person_id === person.id).sort((a,b) => a.id.localeCompare(b.id)));
}
assert.equal((await repo.listObservations('traveler-01', {from:'2026-01-01',to:'2026-01-02'})).data.length, 12);
console.log('PASS: publishable-key reads match all 4 profiles, 4320 observations, 12 events and date filters. No fallback used.');
