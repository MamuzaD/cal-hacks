#!/bin/bash

# Railway start script for deploying both frontend and backend
set -e

echo "🚀 Starting deployment process..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend

# Check if pnpm is available, otherwise use npm
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
    pnpm build
else
    echo "Using npm..."
    npm install
    npm run build
fi

cd ..

# Start the backend (which will serve the frontend)
echo "🔧 Starting backend server..."
cd backend

# Install Python dependencies
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Start the server
echo "🎉 Starting application..."
python3 -m uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}

