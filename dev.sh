#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Cal-hacks Development Environment...${NC}\n"

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Warning: backend/.env file not found${NC}"
    echo -e "${YELLOW}Please create it from backend/env.example${NC}\n"
fi

# Check if virtual environment exists
if [ ! -d "backend/.venv" ] && [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}Warning: No virtual environment found in backend/${NC}"
    echo -e "${YELLOW}Please run: cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt${NC}\n"
fi

# Start FastAPI backend
echo -e "${GREEN}Starting FastAPI backend on http://localhost:8000${NC}"
cd backend

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Find Python executable
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo -e "${RED}Error: Python not found. Please install Python 3.11+${NC}"
    exit 1
fi

$PYTHON_CMD -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start and check if it's still running
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Error: Backend failed to start${NC}"
    echo -e "${YELLOW}Make sure you have:${NC}"
    echo -e "  - Virtual environment created in backend/.venv"
    echo -e "  - Dependencies installed: pip install -r requirements.txt"
    echo -e "  - .env file configured with DATABASE_URL and ANTHROPIC_API_KEY"
    exit 1
fi

# Start React frontend
echo -e "${GREEN}Starting React frontend on http://localhost:3000${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for user interrupt
echo -e "\n${GREEN}✓ Both services are running!${NC}"
echo -e "${GREEN}Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Wait for both processes
wait

