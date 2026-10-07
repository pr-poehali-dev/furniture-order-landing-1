CREATE TABLE IF NOT EXISTS t_p97508351_furniture_order_land.videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL DEFAULT '',
  video_url TEXT NOT NULL,
  poster_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);