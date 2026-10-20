// Tests for the migration gap check (scripts/migration-gap.mjs).
// Run: node --test scripts/migration-gap.test.mjs

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { readMigrations, liveObjects, plan, probeSql, report } from './migration-gap.mjs'

const SCRIPT = new URL('./migration-gap.mjs', import.meta.url).pathname

function folder(files) {
  const dir = mkdtempSync(join(tmpdir(), 'migration-gap-'))
  for (const [name, sql] of Object.entries(files)) writeFileSync(join(dir, name), sql)
  return dir
}

const FILES = {
  '001_start.sql': 'create table if not exists public.profiles (id uuid primary key);',
  '002_referrals.sql': `-- create table public.in_a_comment (id int);
create table if not exists public.referral_codes (id uuid);
create table public.referrals (id uuid);
alter table public.profiles add column if not exists referral_code text, add column joined_via text;
create or replace function public.apply_referral(code text) returns void as $$ select 1 $$ language sql;`,
  '003_gone.sql': `create table public.temporary_idea (id int);
drop table if exists public.temporary_idea;
alter table public.profiles drop column joined_via;`,
  '004_renames.sql': `create table public.old_name (id int, note text);
alter table public.old_name rename to new_name;
alter table public.profiles rename column referral_code to ref_code;`,
  '005_content_only.sql': `update public.scripts set title = 'x' where id = 1;`,
  '006_backup.sql': 'create table schools.school_lessons_backup_006 as select * from schools.school_lessons;',
}

const objects = migrations => [...liveObjects(migrations).values()].map(o => `${o.kind} ${o.object} ${o.file.slice(0, 3)}`)

test('what each migration leaves behind is followed through drops and renames', () => {
  const migrations = readMigrations({ dir: folder(FILES) })
  const got = objects(migrations)
  assert.ok(got.includes('table public.referral_codes 002'))
  assert.ok(got.includes('table public.referrals 002'))
  assert.ok(got.includes('function public.apply_referral 002'))
  assert.ok(!got.some(o => o.includes('in_a_comment')), 'a comment is not a statement')
  assert.ok(!got.some(o => o.includes('temporary_idea')), 'a dropped table is not asked for')
  assert.ok(!got.some(o => o.includes('profiles.joined_via')), 'a dropped column is not asked for')
  assert.ok(got.includes('table public.new_name 004'), 'a renamed table is asked for by its new name')
  assert.ok(!got.some(o => o.includes('public.old_name')))
  assert.ok(got.includes('column public.profiles.ref_code 002'), 'a renamed column keeps the migration that added it')
  assert.ok(!got.some(o => o.includes('profiles.referral_code')))
})

test('the plan covers a window, and names the migrations it cannot check', () => {
  const migrations = readMigrations({ dir: folder(FILES) })
  const p = plan(migrations, { since: 2 })
  assert.equal(p.from, 2)
  assert.deepEqual(p.notCheckable, ['003_gone.sql', '005_content_only.sql'], 'a migration whose objects are all gone leaves nothing to look for')
  assert.ok(!p.wanted.some(o => o.file.startsWith('001')), 'older than the window is not asked for')
  assert.equal(plan(migrations, { all: true }).from, 0)
})

test('the probe is one read only select with a row per object', () => {
  const p = plan(readMigrations({ dir: folder(FILES) }), { all: true })
  const sql = probeSql(p.wanted)
  assert.match(sql, /^-- Read only/)
  assert.doesNotMatch(sql, /\b(insert|update|delete|drop|alter|truncate)\b/i, 'no write verbs')
  assert.match(sql, /'public\.referral_codes'/)
  assert.match(sql, /information_schema\.tables/)
  assert.equal((sql.match(/;/g) || []).length, 1, 'a single statement')
})

const answer = (planned, absent = []) =>
  planned.wanted.map(o => ({ file: o.file, kind: o.kind, object: o.object, present: !absent.includes(o.object) }))

test('migration 360 style gap: a migration whose tables are not there is named', () => {
  const planned = plan(readMigrations({ dir: folder(FILES) }), { since: 2 })
  const out = report(planned, answer(planned, ['public.referral_codes', 'public.referrals']))
  assert.equal(out.status, 'gap')
  const text = out.lines.join('\n')
  assert.match(text, /002_referrals\.sql is not fully applied: missing table public\.referral_codes, table public\.referrals/)
  assert.match(text, /Not checkable by this probe.*005_content_only\.sql/)
})

test('clean only when every object came back present', () => {
  const planned = plan(readMigrations({ dir: folder(FILES) }), { since: 2 })
  const clean = report(planned, answer(planned))
  assert.equal(clean.status, 'clean')
  assert.match(clean.lines[0], /^Migration gap: none\./)
  assert.equal(report(planned, []).status, 'unknown', 'no rows is unknown, never clean')
  assert.equal(report(planned, null).status, 'unknown')
  const partial = report(planned, answer(planned).slice(1))
  assert.equal(partial.status, 'unknown', 'a missing answer is not treated as present')
  assert.match(partial.lines[0], /unknown for 1 of/)
})

test('a missing backup snapshot is mentioned softly and is not a gap', () => {
  const planned = plan(readMigrations({ dir: folder(FILES) }), { since: 2 })
  const out = report(planned, answer(planned, ['schools.school_lessons_backup_006']))
  assert.equal(out.status, 'clean')
  assert.match(out.lines.join('\n'), /Backup snapshots absent.*006_backup\.sql/)
})

test('the command line: probe prints sql, report exits 1 on a gap and 2 on unreadable rows', () => {
  const dir = folder(FILES)
  const probe = spawnSync(process.execPath, [SCRIPT, 'probe', '--dir', dir, '--all'], { encoding: 'utf8' })
  assert.equal(probe.status, 0, probe.stderr)
  assert.match(probe.stdout, /with wanted\(file, kind, object\)/)
  const planned = plan(readMigrations({ dir }), { all: true })
  const rowsFile = join(dir, 'rows.json')
  writeFileSync(rowsFile, JSON.stringify({ rows: answer(planned, ['public.referrals']) }))
  const gap = spawnSync(process.execPath, [SCRIPT, 'report', '--dir', dir, '--all', '--rows', rowsFile], { encoding: 'utf8' })
  assert.equal(gap.status, 1)
  assert.match(gap.stdout, /002_referrals\.sql is not fully applied/)
  const none = spawnSync(process.execPath, [SCRIPT, 'report', '--dir', dir, '--all', '--rows', join(dir, 'nope.json')], { encoding: 'utf8' })
  assert.equal(none.status, 2)
  assert.match(none.stdout, /Migration gap: unknown/)
})

test('it runs on the real migrations folder without throwing', () => {
  const migrations = readMigrations({ dir: new URL('../supabase/migrations', import.meta.url).pathname })
  const p = plan(migrations)
  assert.ok(p.wanted.length > 0 && p.inWindow <= 45)
  assert.ok(migrations.length > 300)
})
