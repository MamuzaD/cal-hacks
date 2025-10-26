#!/bin/bash

# Railway start script for deploying both frontend and backend
set -e

echo "🚀 Starting deployment process..."

# Check if Node.js is available (should be from build phase)
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js not found in PATH"
    echo "Available node: $(which node || echo 'not found')"
    echo "PATH: $PATH"
fi

# Verify frontend is built (should have been done in build phase)
if [ ! -d "frontend/dist" ]; then
    echo "⚠️  Frontend not built, building now..."
    cd frontend
    
    # Install pnpm if not available
    if ! command -v pnpm &> /dev/null; then
        echo "Installing pnpm..."
        npm install -g pnpm
    fi
    
    pnpm install
    pnpm run build
    cd ..
fi

echo "✅ Frontend build verified"

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

