create table users
(
    id         bigint PRIMARY KEY,
    username   VARCHAR(2000),
    first_name VARCHAR(2000),
    last_name  VARCHAR(2000),
    is_premium BOOL DEFAULT false,
    score      INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_id ON users (id);
CREATE INDEX idx_users_score ON users (score DESC);