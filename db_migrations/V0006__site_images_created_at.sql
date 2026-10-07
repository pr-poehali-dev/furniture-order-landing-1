ALTER TABLE t_p97508351_furniture_order_land.site_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
UPDATE t_p97508351_furniture_order_land.site_images SET created_at = updated_at WHERE created_at IS NULL;
ALTER TABLE t_p97508351_furniture_order_land.site_images ALTER COLUMN created_at SET DEFAULT NOW();