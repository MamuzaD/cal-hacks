#!/bin/bash
set -e

echo "🔨 Railway Build Phase"
echo "===================="

# Build frontend
echo "📦 Building frontend..."
cd frontend

# Install pnpm globally if not available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

pnpm install
pnpm run build
cd ..

echo "✅ Build complete"
echo "Frontend dist directory contents:"
ls -la frontend/dist/ || echo "dist directory not found"

