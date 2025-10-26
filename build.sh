#!/bin/bash
set -e

echo "🔨 Building frontend..."
cd frontend

# Enable corepack for pnpm support
corepack enable && corepack prepare pnpm@latest --activate

pnpm install
pnpm run build
cd ..

echo "📦 Installing backend dependencies..."
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
cd ..

echo "✅ Build complete"

