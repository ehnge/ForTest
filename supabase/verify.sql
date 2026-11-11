-- Run using authenticated management access. Tests roll back every attempted mutation.
begin;
do $$
declare t text; r text;
begin
  foreach t in array array['sample_people','health_observations','demo_events'] loop
    if not (select relrowsecurity from pg_class where oid=('public.'||t)::regclass) then
      raise exception 'RLS missing on %', t;
    end if;
    foreach r in array array['anon','authenticated'] loop
      if not has_table_privilege(r,'public.'||t,'SELECT') then raise exception 'Read grant missing'; end if;
      if has_table_privilege(r,'public.'||t,'INSERT,UPDATE,DELETE,TRUNCATE') then raise exception 'Write privilege present'; end if;
    end loop;
  end loop;
end $$;
set local role anon;
select count(*) as anon_people from public.sample_people;
select count(*) as anon_observations from public.health_observations;
select count(*) as anon_events from public.demo_events;
do $$
begin
  begin
    insert into public.sample_people values ('rls-probe','Synthetic Probe','active',0,true);
    raise exception 'Unexpected anonymous insert success';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.health_observations set value=value where false;
    raise exception 'Unexpected anonymous update success';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.demo_events where false;
    raise exception 'Unexpected anonymous delete success';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
set local role authenticated;
select count(*) as authenticated_people from public.sample_people;
do $$
begin
  begin
    insert into public.sample_people values ('rls-probe','Synthetic Probe','active',0,true);
    raise exception 'Unexpected authenticated insert success';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
rollback;
