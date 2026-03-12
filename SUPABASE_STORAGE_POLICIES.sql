-- Storage policies for portfolio-assets bucket (run this ONLY - policies already exist for tables)
create policy "portfolio-assets insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-assets');

create policy "portfolio-assets update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-assets');

create policy "portfolio-assets delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-assets');

create policy "portfolio-assets public read" on storage.objects
  for select using (bucket_id = 'portfolio-assets');
