-- Schema for storing tunes fetched from TheSession.org

CREATE TABLE IF NOT EXISTS tunes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thesession_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    meter TEXT,
    mode TEXT,
    key TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tunes_type ON tunes(type);
