#!/bin/bash
set -e

echo "🚀 Starting application..."
cd backend
python3 -m uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}

