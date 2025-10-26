# Railway Deployment Guide

This project is configured to deploy both the frontend (React) and backend (FastAPI) as a single service on Railway.

## Project Structure

```
cal-hacks/
├── backend/          # FastAPI backend
│   ├── src/
│   │   └── main.py  # FastAPI app that serves static files
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   └── package.json
├── start.sh         # Railway start script
└── railway.toml     # Railway configuration
```

## How It Works

1. **Build Phase**: The `start.sh` script builds the frontend React app
   ```bash
   cd frontend && npm ci && npm run build
   ```

2. **Start Phase**: The backend starts with uvicorn and serves:
   - API routes at `/search`, `/search/company`, `/search/person`
   - Static frontend files (JS, CSS, images)
   - React SPA routes - all other paths serve `index.html`

3. **Static File Serving**: FastAPI serves the built frontend from `frontend/dist/`:
   - `/assets/*` - Frontend JS/CSS files
   - Root files (index.html, favicon.ico, etc.)
   - All other paths fall back to `index.html` for client-side routing

## Deployment to Railway

### Option 1: Deploy from GitHub

1. Push this repository to GitHub
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically:
   - Detect the `railway.toml` configuration
   - Run the `start.sh` script
   - Build the frontend and start the backend

### Option 2: Deploy via CLI

1. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and link your project:
   ```bash
   railway login
   railway link
   ```

3. Deploy:
   ```bash
   railway up
   ```

## Environment Variables

Set these in Railway's environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Anthropic API key for AI classification (optional)
- `PORT` - Server port (automatically set by Railway)

## How the Routes Work

- **API Routes** (defined in `backend/src/main.py`):
  - `GET /` - API welcome message
  - `GET /search?q=...` - General search with AI classification
  - `GET /search/company?q=...` - Company search
  - `GET /search/person?q=...` - Person search

- **Frontend Routes**:
  - All other routes serve the React app's `index.html`
  - Static assets (JS, CSS) served from `frontend/dist/assets/`

## Troubleshooting

### Frontend not loading

Check the logs to see if the frontend dist directory exists:
```
Frontend dist directory not found at: /path/to/frontend/dist
```

This means the frontend build failed. Check the build logs.

### API routes returning 404

Make sure your frontend is configured to make API calls to the correct base URL. The backend serves everything from the same domain, so relative URLs should work.

### Database connection issues

Ensure `DATABASE_URL` is set in Railway's environment variables. Railway provides a PostgreSQL database that can be linked to your project.

## Development & Testing

### Option 1: Quick Test with the Start Script

This is the easiest way to test the Railway deployment locally:

```bash
# Make sure you have environment variables set
cp backend/env.example backend/.env
# Edit backend/.env with your actual values

# Run the start script (same as Railway will run)
bash start.sh
```

Visit `http://localhost:8000` to see the combined app.

### Option 2: Manual Testing

#### 1. Build and Test Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm ci

# Build the frontend
npm run build

# Verify the build succeeded
ls dist/  # Should show index.html, assets/, etc.
```

#### 2. Set Up Backend Environment

```bash
# Navigate to backend
cd ../backend

# Create virtual environment if it doesn't exist
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Set environment variables
# Copy the example file
cp env.example .env
# Edit .env with your actual DATABASE_URL and ANTHROPIC_API_KEY
```

#### 3. Run the Backend (Serves Frontend)

```bash
# Make sure you're in the backend directory
cd backend
source venv/bin/activate

# Start the server
python3 -m uvicorn src.main:app --reload --port 8000
```

#### 4. Test the Application

Open your browser and test:

- **Frontend**: Visit `http://localhost:8000` - Should show the React app
- **API Root**: `http://localhost:8000/` - Should show `{"message": "Welcome to Web Weyes!"}`
- **Search API**: `http://localhost:8000/search?q=apple` - Should return search results
- **Check Logs**: Look for "Serving frontend from:" and "Mounted /assets directory" messages

#### 5. Test Static File Serving

```bash
# Test that assets are being served
curl http://localhost:8000/assets/
# Should list available JS/CSS files

# Test that index.html serves for unknown routes
curl http://localhost:8000/any-route
# Should return the React app's HTML
```

### Expected Behavior

✅ **Working correctly**:
- API endpoints like `/search` work
- Frontend loads at the root URL
- Static assets (JS, CSS) load correctly
- Client-side routing works (all paths serve index.html)
- Terminal logs show "Serving frontend from:" message

❌ **Common issues**:
- `Frontend dist directory not found` - Frontend didn't build
- 404 on assets - Check that assets directory exists in `frontend/dist/`
- API returns 404 - Check that routes aren't being caught by the catch-all

