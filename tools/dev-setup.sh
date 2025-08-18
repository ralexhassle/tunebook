#!/bin/bash

# Development Setup Script for Tunebook
# This script sets up the local development environment

echo "🎵 Tunebook Development Setup"
echo "============================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed."
    echo "Please install it from: https://pnpm.io/installation"
    exit 1
fi

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "Please install it from: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the configuration."
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Docker services started successfully!"
    echo ""
    echo "🔍 Service Status:"
    docker-compose ps
else
    echo "❌ Failed to start Docker services"
    exit 1
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available Commands:"
echo "  pnpm dev          - Start all services in development mode"
echo "  pnpm test         - Run tests"
echo "  pnpm lint         - Lint code"
echo "  pnpm type-check   - Type check TypeScript"
echo "  pnpm docker:up    - Start Docker services"
echo "  pnpm docker:down  - Stop Docker services"
echo ""
echo "📖 Next Steps:"
echo "1. Review the specs in .kiro/specs/tunebook-monorepo/"
echo "2. Start implementing tasks from tasks.md"
echo "3. Begin with task 1: Initialize monorepo structure"
echo ""
echo "🎵 Happy coding with Tunebook!"