-- Initial database setup for Tunebook
-- This script creates the basic database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create basic tables (will be managed by Prisma migrations later)
-- This is just to ensure the database is properly initialized

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('initialized');