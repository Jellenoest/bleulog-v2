alter table public.dives
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Alle bestaande BlueLog-duiken worden aan Jellenoest gekoppeld.
update public.dives
set user_id = '79c5cc5b-e42b-4dd7-a2f0-93973f6e546a'
where user_id is null;

alter table public.dives
alter column user_id set not null;

create index if not exists dives_user_id_idx
on public.dives(user_id);

alter table public.dives enable row level security;

drop policy if exists "Users can read own dives" on public.dives;
drop policy if exists "Users can insert own dives" on public.dives;
drop policy if exists "Users can update own dives" on public.dives;
drop policy if exists "Users can delete own dives" on public.dives;

create policy "Users can read own dives"
on public.dives
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own dives"
on public.dives
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own dives"
on public.dives
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own dives"
on public.dives
for delete
to authenticated
using ((select auth.uid()) = user_id);
