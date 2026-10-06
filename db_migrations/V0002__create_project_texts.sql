CREATE TABLE IF NOT EXISTS t_p97508351_furniture_order_land.project_texts (
    project_key VARCHAR(128) PRIMARY KEY,
    description TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);