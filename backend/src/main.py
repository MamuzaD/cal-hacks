from typing import Union, List, Optional
from fastapi import FastAPI, Query, HTTPException, Depends
from pydantic import BaseModel
from datetime import date
import asyncpg
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://testuser:testpassword@localhost:5432/railway")
db_pool = None

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

@app.get("/")
def get_root():
    return {"message": "Welcome to Web Weyes!"}

# pull up a company and see what politicians have holdings in it
@app.get("/search/company", response_model=CompanySearchResponse)
async def company_search(
    q: str = Query(..., description="Company name or ticker to search for"),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Search for a company and return politicians who have financial holdings in it.
    Returns ownership amounts and politician details.
    """
    try:
        # SQL query to find all politicians with holdings in the specified company
        # Using JOIN between politicians and holdings tables
        query = """
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
        
        # Execute query with case-insensitive search
        search_pattern = f"%{q}%"
        rows = await db.fetch(query, search_pattern, search_pattern)
        
        if not rows:
            # Return empty result if no matches found
            return CompanySearchResponse(
                company=q.title(),
                ticker=q.upper() if len(q) <= 5 else None,
                total_politicians=0,
                total_ownership_value=0.00,
                politician_holdings=[]
            )
        
        # Convert database rows to Pydantic models
        politician_holdings = []
        total_ownership_value = 0.0
        company_name = rows[0]['company']  # Use actual company name from DB
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
            
            # Sum up total ownership value
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

# pull up a person and see their stock holdings and company ownership
@app.get("/search/person", response_model=PersonSearchResponse)
async def person_search(
    q: str = Query(..., description="Politician name to search for"),
    db: asyncpg.Connection = Depends(get_db)
):
    """
    Search for a politician and return their financial holdings and company ownership.
    Returns all companies they have ownership stakes in.
    """
    try:
        # First, get the politician's basic info
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
        
        search_pattern = f"%{q}%"
        politician_info = await db.fetchrow(politician_info_query, search_pattern)
        
        if not politician_info:
            # Return empty result if politician not found
            return PersonSearchResponse(
                politician_id=0,
                politician_name=q.title(),
                position="Unknown",
                state="Unknown",
                party_affiliation="Other",
                start_date_of_position=date(2021, 1, 3),
                total_holdings_count=0,
                total_ownership_value=0.00,
                company_holdings=[]
            )
        
        # Get all holdings for this politician using JOIN
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
            
            # Sum up total ownership value
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
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
