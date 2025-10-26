from typing import Union, List, Optional
from fastapi import FastAPI, Query, HTTPException, Depends, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import date
import asyncpg
import os
import json
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import anthropic
import logging

logger = logging.getLogger(__name__)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
db_pool = None

# Initialize Anthropic client if API key is available
anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    db_pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    await db_pool.close()

app = FastAPI(
    title="Web Weyes - Political Holdings API",
    description="API for exploring politician financial holdings and company ownership",
    version="1.0.0",
    lifespan=lifespan
)

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

async def get_db():
    async with db_pool.acquire() as connection:
        yield connection

class PoliticianHolding(BaseModel):
    politician_id: int
    politician_name: str
    position: str
    total_ownership: Optional[float]
    state: str
    party_affiliation: str
    start_date_of_position: date

class CompanySearchResponse(BaseModel):
    company: str
    ticker: Optional[str]
    total_politicians: int
    total_ownership_value: float
    politician_holdings: List[PoliticianHolding]

class CompanyHolding(BaseModel):
    holding_id: int
    company: str
    ticker: Optional[str]
    total_ownership: Optional[float]

class PersonSearchResponse(BaseModel):
    politician_id: int
    politician_name: str
    position: str
    state: str
    party_affiliation: str
    start_date_of_position: date
    total_holdings_count: int
    total_ownership_value: float
    company_holdings: List[CompanyHolding]

class GeneralSearchResponse(BaseModel):
    search_term: str
    detected_type: str  # "person" or "company"
    confidence: float
    reasoning: str
    result: Union[PersonSearchResponse, CompanySearchResponse]

# Root route for API docs
@app.get("/")
async def api_root():
    return {"message": "Web Weyes API", "docs": "/docs", "api": "/api"}

# Separate functions for database operations
async def search_company_in_db(query: str, db: asyncpg.Connection) -> CompanySearchResponse:
    """
    Search for a company in the database and return politicians who have holdings.
    """
    try:
        # SQL query to find all politicians with holdings in the specified company
        sql_query = """
        SELECT 
            p.id as politician_id,
            p.name as politician_name,
            p.position,
            p.state,
            p.party_affiliation,
            p.start_date_of_position,
            h.company,
            h.ticker,
            h.total_ownership
        FROM politicians p
        JOIN holdings h ON p.id = h.politician_id
        WHERE h.company ILIKE $1 OR h.ticker ILIKE $2
        ORDER BY h.total_ownership DESC NULLS LAST, p.name ASC
        """
        
        search_pattern = f"%{query}%"
        rows = await db.fetch(sql_query, search_pattern, search_pattern)
        
        if not rows:
            return CompanySearchResponse(
                company=query.title(),
                ticker=query.upper() if len(query) <= 5 else None,
                total_politicians=0,
                total_ownership_value=0.00,
                politician_holdings=[]
            )
        
        # Convert database rows to Pydantic models
        politician_holdings = []
        total_ownership_value = 0.0
        company_name = rows[0]['company']
        ticker = rows[0]['ticker']
        
        for row in rows:
            holding = PoliticianHolding(
                politician_id=row['politician_id'],
                politician_name=row['politician_name'],
                position=row['position'],
                total_ownership=float(row['total_ownership']) if row['total_ownership'] else 0.0,
                state=row['state'],
                party_affiliation=row['party_affiliation'],
                start_date_of_position=row['start_date_of_position']
            )
            politician_holdings.append(holding)
            
            if row['total_ownership']:
                total_ownership_value += float(row['total_ownership'])
        
        return CompanySearchResponse(
            company=company_name,
            ticker=ticker,
            total_politicians=len(politician_holdings),
            total_ownership_value=total_ownership_value,
            politician_holdings=politician_holdings
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

async def search_person_in_db(query: str, db: asyncpg.Connection) -> PersonSearchResponse:
    """
    Search for a politician in the database and return their holdings.
    """
    try:
        # Get politician's basic info
        politician_info_query = """
        SELECT 
            id,
            name,
            position,
            state,
            party_affiliation,
            start_date_of_position
        FROM politicians 
        WHERE name ILIKE $1
        LIMIT 1
        """
        
        search_pattern = f"%{query}%"
        politician_info = await db.fetchrow(politician_info_query, search_pattern)
        
        if not politician_info:
            return PersonSearchResponse(
                politician_id=0,
                politician_name=query.title(),
                position="Unknown",
                state="Unknown",
                party_affiliation="Other",
                start_date_of_position=date(2021, 1, 3),
                total_holdings_count=0,
                total_ownership_value=0.00,
                company_holdings=[]
            )
        
        # Get all holdings for this politician
        holdings_query = """
        SELECT 
            h.id as holding_id,
            h.company,
            h.ticker,
            h.total_ownership
        FROM holdings h
        WHERE h.politician_id = $1
        ORDER BY h.total_ownership DESC NULLS LAST, h.company ASC
        """
        
        holdings_rows = await db.fetch(holdings_query, politician_info['id'])
        
        # Convert database rows to Pydantic models
        company_holdings = []
        total_ownership_value = 0.0
        
        for row in holdings_rows:
            holding = CompanyHolding(
                holding_id=row['holding_id'],
                company=row['company'],
                ticker=row['ticker'],
                total_ownership=float(row['total_ownership']) if row['total_ownership'] else 0.0
            )
            company_holdings.append(holding)
            
            if row['total_ownership']:
                total_ownership_value += float(row['total_ownership'])
        
        return PersonSearchResponse(
            politician_id=politician_info['id'],
            politician_name=politician_info['name'],
            position=politician_info['position'],
            state=politician_info['state'],
            party_affiliation=politician_info['party_affiliation'],
            start_date_of_position=politician_info['start_date_of_position'],
            total_holdings_count=len(company_holdings),
            total_ownership_value=total_ownership_value,
            company_holdings=company_holdings
        )
        
    except asyncpg.PostgresError as e:
        logger.exception("DB error in person_search")
        raise HTTPException(status_code=500, detail="Internal server error") from e

async def classify_search_term(search_term: str) -> dict:
    """
    Use Claude/Anthropic to classify if a search term is a person or company.
    """
    if not anthropic_client:
        # Fallback logic if Anthropic is not available
        # Simple heuristics: if it looks like a person name (2-3 words, capitalized)
        words = search_term.strip().split()
        if len(words) >= 2 and len(words) <= 3 and all(word[0].isupper() for word in words if word):
            return {
                "type": "person",
                "confidence": 0.6,
                "reasoning": "Fallback heuristic: appears to be a person name (2-3 capitalized words)"
            }
        else:
            return {
                "type": "company",
                "confidence": 0.6,
                "reasoning": "Fallback heuristic: does not match person name pattern, assuming company"
            }
    
    try:
        prompt = f"""
        Analyze this search term and determine if it refers to a PERSON (politician/individual) or a COMPANY (corporation/organization).

        Search term: "{search_term}"

        Consider:
        - Person names typically have 2-3 words (first, middle, last name)
        - Company names often include words like "Inc", "Corp", "LLC", "Group", "Systems", etc.
        - Stock tickers are usually 3-5 uppercase letters
        - Political figures often have titles or are known by partial names

        Respond with valid JSON only:
        {{
            "type": "person" or "company",
            "confidence": 0.0-1.0,
            "reasoning": "brief explanation of your decision"
        }}
        """
        
        response = anthropic_client.messages.create(
            model="claude-3-haiku-20240307",  # Using Haiku for faster/cheaper classification
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        
        result = json.loads(response.content[0].text)
        
        # Validate required fields
        if not all(key in result for key in ["type", "confidence", "reasoning"]):
            raise ValueError("Invalid response structure from Claude")
        if result["type"] not in ["person", "company"]:
            raise ValueError(f"Invalid type from Claude: {result['type']}")
        return result
        
    except (json.JSONDecodeError, ValueError, anthropic.APIError) as e:
        logger.warning(f"Claude classification failed: {e}")

        # Fallback if Claude fails
        return {
            "type": "company",
            "confidence": 0.3,
            "reasoning": "Claude classification unavailable, defaulting to company"
        }

# General search endpoint
@api_router.get("/search", response_model=GeneralSearchResponse)
async def general_search(
    q: str = Query(..., description="Search term (person or company)"),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    General search endpoint that uses AI to determine if the query is for a person or company,
    then calls the appropriate search function.
    """
    try:
        # Classify the search term using Claude
        classification = await classify_search_term(q)
        
        # Call the appropriate search function based on classification
        if classification["type"] == "person":
            result = await search_person_in_db(q, db)
        else:  # company
            result = await search_company_in_db(q, db)
        
        return GeneralSearchResponse(
            search_term=q,
            detected_type=classification["type"],
            confidence=classification["confidence"],
            reasoning=classification["reasoning"],
            result=result
        )
        
    except asyncpg.PostgresError as e:
        logger.exception("DB error in general_search")
        raise HTTPException(status_code=500, detail="Internal server error") from e

# Specific endpoint for company search (calls the separate function)
@api_router.get("/search/company", response_model=CompanySearchResponse)
async def company_search(
    q: str = Query(..., description="Company name or ticker to search for"),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Search for a company and return politicians who have financial holdings in it.
    Returns ownership amounts and politician details.
    """
    return await search_company_in_db(q, db)

# Specific endpoint for person search (calls the separate function)
@api_router.get("/search/person", response_model=PersonSearchResponse)
async def person_search(
    q: str = Query(..., description="Politician name to search for"),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Search for a politician and return their financial holdings and company ownership.
    Returns all companies they have ownership stakes in.
    """
    return await search_person_in_db(q, db)

# Mount the API router
app.include_router(api_router)
logger.info("Mounted API router at /api")

# Mount static files from the frontend build directory
# This serves the React app's static assets (JS, CSS, images, etc.)
# Get the project root (two levels up from backend/src/main.py)
_current_dir = os.path.dirname(__file__)
_backend_dir = os.path.dirname(_current_dir)
_project_root = os.path.dirname(_backend_dir)
frontend_dist = os.path.join(_project_root, "frontend", "dist")

# Only mount static files if the dist directory exists
if os.path.exists(frontend_dist):
    logger.info(f"Serving frontend from: {frontend_dist}")
    
    # Serve all static files from the dist directory
    # This includes: index.html, favicon.ico, robots.txt, assets/, etc.
    try:
        app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="static-assets")
        logger.info("Mounted /assets directory")
    except Exception as e:
        logger.warning(f"Could not mount /assets: {e}")
    
    # Catch-all route: serve the React app's index.html for client-side routing
    # This must be last to not override API routes.
    # FastAPI will only call this if no earlier route matches.
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """
        Catch-all route to serve the React app for client-side routing.
        This only matches if no API route (like /api/search) has matched.
        """
        # Check if it's a static file request (has file extension)
        if "." in os.path.basename(full_path):
            # Try to serve the actual file (like favicon.ico, robots.txt, etc.)
            file_path = os.path.join(frontend_dist, full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
        
        # For all other paths, serve index.html for SPA routing
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        
        # Fallback to 404 if index.html doesn't exist
        raise HTTPException(status_code=404, detail="Not found")
else:
    logger.warning(f"Frontend dist directory not found at: {frontend_dist}")
