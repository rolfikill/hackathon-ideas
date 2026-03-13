-- Ideas table
create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null
);

-- Votes table
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(idea_id, user_id)
);

-- Comments table
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table ideas enable row level security;
alter table votes enable row level security;
alter table comments enable row level security;

-- RLS Policies: ideas
create policy "Ideas are viewable by everyone" on ideas
  for select using (true);

create policy "Authenticated users can insert ideas" on ideas
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own ideas" on ideas
  for update using (auth.uid() = user_id);

create policy "Users can delete their own ideas" on ideas
  for delete using (auth.uid() = user_id);

-- RLS Policies: votes
create policy "Votes are viewable by everyone" on votes
  for select using (true);

create policy "Authenticated users can insert their own votes" on votes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own votes" on votes
  for delete using (auth.uid() = user_id);

-- RLS Policies: comments
create policy "Comments are viewable by everyone" on comments
  for select using (true);

create policy "Authenticated users can insert comments" on comments
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own comments" on comments
  for delete using (auth.uid() = user_id);
