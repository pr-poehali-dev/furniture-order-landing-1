CREATE TABLE IF NOT EXISTS t_p97508351_furniture_order_land.leads (
    id SERIAL PRIMARY KEY,
    source VARCHAR(64) NOT NULL,
    name VARCHAR(200),
    phone VARCHAR(64) NOT NULL,
    details TEXT,
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);