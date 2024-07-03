CREATE TABLE IF NOT EXISTS coordinates_backup
(
    id			VARCHAR(36) PRIMARY KEY,
    device_id	VARCHAR(255) UNIQUE NOT NULL,
    x			FLOAT,
    y			FLOAT
);