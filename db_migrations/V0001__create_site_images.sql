CREATE TABLE IF NOT EXISTS t_p97508351_furniture_order_land.site_images (
    slot_key VARCHAR(128) PRIMARY KEY,
    url TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);