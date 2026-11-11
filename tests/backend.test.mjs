import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { generateSyntheticData, dateAt } from '../src/data/synthetic.ts';
import { createHorizonRepository, isObservation } from '../src/data/repository.ts';
const fixture = generateSyntheticData();

test('four synthetic travelers have 180 complete days and six metrics', () => {
  assert.equal(fixture.people.length, 4);
  assert.equal(fixture.observations.length, 4320);
  assert.equal(new Set(fixture.observations.map(o => o.id)).size, 4320);
  for (const p of fixture.people) {
    const rows = fixture.observations.filter(o => o.person_id === p.id);
    assert.equal(rows.length, 1080);
    assert.equal(new Set(rows.map(o => o.observed_on)).size, 180);
    assert.ok(rows.every(isObservation));
  }
});
test('same seed reproduces data; other seeds change values; invalid seeds fail', () => {
  assert.deepEqual(generateSyntheticData(), fixture);
  assert.notEqual(generateSyntheticData(43).observations[0].value, fixture.observations[0].value);
  for (const seed of [-1, 1.2, NaN, 1000001]) assert.throws(() => generateSyntheticData(seed));
});
test('events have exact inclusive 3/5/5 day durations and signal changes', () => {
  assert.equal(fixture.events.length, 12);
  for (const event of fixture.events) {
    const days = (Date.parse(event.ends_on) - Date.parse(event.starts_on)) / 86400000 + 1;
    assert.equal(days, event.kind === 'radiation_spike' ? 3 : 5);
  }
  const rows = fixture.observations.filter(o => o.person_id === 'traveler-01');
  assert.ok(rows.filter(o => o.metric === 'radiation_dose' && o.observed_on >= dateAt(100) && o.observed_on <= dateAt(102)).every(o => o.value > 1.5));
  assert.ok(rows.filter(o => o.metric === 'sleep_hours' && o.observed_on >= dateAt(150) && o.observed_on <= dateAt(154)).every(o => o.value < 6));
});
test('local repository filters dates, preserves empty results and reports fallback', async () => {
  const repo = createHorizonRepository(null);
  assert.equal((await repo.listPeople()).source, 'local');
  const result = await repo.listObservations('traveler-01', {from: dateAt(0), to: dateAt(1)});
  assert.equal(result.data.length, 12);
  assert.ok(result.warning);
  assert.equal((await repo.listObservations('unknown')).data.length, 0);
  assert.throws(() => repo.listObservations('traveler-01', {from:'2026-02-30'}));
  assert.throws(() => repo.listObservations('traveler-01', {from:dateAt(4), to:dateAt(2)}));
});
test('simulation controls expose deterministic replay and data-quality states', async () => {
  const repo = createHorizonRepository(null);
  const replay = await repo.listEvents('traveler-01', {controls:{seed:42, replayCount:1, scenario:'usual'}});
  assert.equal(replay.source, 'local');
  assert.match(replay.warning, /Replay/);
  const stale = await repo.listObservations('traveler-01', {controls:{seed:42, replayCount:0, scenario:'stale'}});
  assert.equal(stale.quality, 'stale-data');
  const disconnected = await repo.listObservations('traveler-01', {controls:{seed:42, replayCount:0, scenario:'sensor-disconnected'}});
  assert.equal(disconnected.data.length, 0);
  assert.equal(disconnected.quality, 'missing-data');
  const short = await repo.listObservations('traveler-01', {from:dateAt(0), to:dateAt(1), controls:{seed:42, replayCount:0}});
  assert.equal(short.quality, 'insufficient-baseline');
});
function mockClient(fetcher) {
  return createClient('https://test.supabase.co', 'sb_publishable_test', {
    auth:{persistSession:false}, global:{fetch:fetcher},
  });
}
test('cloud repository paginates more than 1000 observations with filters', async () => {
  let calls = 0;
  const rows = fixture.observations.filter(o => o.person_id === 'traveler-01').sort((a,b) => a.id.localeCompare(b.id));
  const client = mockClient(async input => {
    const url = new URL(String(input)); calls++;
    assert.equal(url.searchParams.get('person_id'), 'eq.traveler-01');
    assert.equal(url.searchParams.get('seed'), 'eq.42');
    assert.equal(url.searchParams.get('is_synthetic'), 'eq.true');
    const offset = Number(url.searchParams.get('offset'));
    return new Response(JSON.stringify(rows.slice(offset, offset + 500)), {status:200});
  });
  const result = await createHorizonRepository(client).listObservations('traveler-01');
  assert.equal(result.source, 'supabase');
  assert.equal(result.data.length, 1080);
  assert.equal(calls, 3);
});
test('failed and malformed cloud data return explicit deterministic fallback', async () => {
  for (const fetcher of [async () => {throw new Error('offline')}, async () => new Response('[{"is_synthetic":false}]')]) {
    const result = await createHorizonRepository(mockClient(fetcher)).listPeople();
    assert.equal(result.source, 'local');
    assert.deepEqual(result.data, fixture.people);
  }
});
test('empty cloud results remain empty', async () => {
  const result = await createHorizonRepository(mockClient(async () => new Response('[]'))).listPeople();
  assert.equal(result.source, 'supabase'); assert.deepEqual(result.data, []);
});
test('observation validation rejects non-synthetic, invalid units, ranges and dates', () => {
  const row = fixture.observations[0];
  for (const change of [{is_synthetic:false}, {unit:'ms'}, {value:NaN}, {value:300},
    {observed_on:'2026-02-30'}, {seed:-1}, {metric:'unknown'}]) {
    assert.equal(isObservation({...row, ...change}), false);
  }
});
