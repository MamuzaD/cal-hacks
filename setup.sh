#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Cal-hacks Development Environment${NC}\n"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    echo -e "${YELLOW}Please install Python 3.11 or higher${NC}"
    exit 1
fi

# Setup backend
echo -e "${GREEN}Setting up backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${YELLOW}Virtual environment already exists${NC}"
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source .venv/bin/activate
pip install -r requirements.txt
deactivate

echo -e "${GREEN}✓ Backend setup complete${NC}\n"

# Copy .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✓ Created .env file from env.example${NC}"
        echo -e "${YELLOW}Please edit .env and add your actual credentials${NC}"
    else
        echo -e "${YELLOW}No env.example found. You'll need to create .env manually.${NC}"
    fi
else
    echo -e "${YELLOW}.env already exists${NC}"
fi

cd ..

# Setup frontend
echo -e "\n${GREEN}Setting up frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
    echo -e "${GREEN}✓ Frontend setup complete${NC}"
else
    echo -e "${YELLOW}node_modules already exists. Run 'npm install' to update dependencies${NC}"
fi

cd ..

echo -e "\n${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}Run './dev.sh' to start development servers${NC}"

