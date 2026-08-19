-- Portfolio showcase schema. All names and identifiers are synthetic.
create extension if not exists pgcrypto;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner', 'reviewer', 'analyst')),
  primary key (organization_id, user_id)
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  path text not null,
  title text,
  meta_description text,
  last_observed_at timestamptz,
  unique (site_id, path)
);

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  status text not null check (status in ('queued', 'running', 'completed', 'failed')),
  created_by uuid not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  page_id uuid references public.pages(id) on delete cascade,
  rule_code text not null,
  severity text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  audit_id uuid not null references public.audits(id) on delete cascade,
  finding_id uuid not null references public.findings(id) on delete cascade,
  summary text not null,
  rationale text not null,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  status text not null default 'proposed' check (status in ('proposed', 'accepted', 'rejected'))
);

create table public.proposed_changes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recommendation_id uuid not null references public.recommendations(id) on delete cascade,
  field_name text not null,
  proposed_value jsonb not null,
  status text not null default 'pending-review' check (status in ('pending-review', 'approved', 'rejected', 'published')),
  approved_by uuid,
  approved_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_organization_id and user_id = auth.uid()
  );
$$;

create or replace function public.can_review(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
      and role in ('owner', 'reviewer')
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.sites enable row level security;
alter table public.pages enable row level security;
alter table public.audits enable row level security;
alter table public.findings enable row level security;
alter table public.recommendations enable row level security;
alter table public.proposed_changes enable row level security;
alter table public.audit_logs enable row level security;

create policy organizations_member_select on public.organizations for select using (public.is_organization_member(id));
create policy members_same_org_select on public.organization_members for select using (public.is_organization_member(organization_id));
create policy sites_member_all on public.sites for all using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id));
create policy pages_member_all on public.pages for all using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id));
create policy audits_member_all on public.audits for all using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id));
create policy findings_member_select on public.findings for select using (public.is_organization_member(organization_id));
create policy recommendations_member_select on public.recommendations for select using (public.is_organization_member(organization_id));
create policy proposed_changes_member_select on public.proposed_changes for select using (public.is_organization_member(organization_id));
create policy proposed_changes_reviewer_update on public.proposed_changes for update using (public.can_review(organization_id)) with check (public.can_review(organization_id));
create policy audit_logs_member_select on public.audit_logs for select using (public.is_organization_member(organization_id));

