"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.lifespan import lifespan
from src.routers import search, graph, person, company

app = FastAPI(
    title="Web Weyes - Connections API",
    description="API for exploring politician financial holdings and company ownership",
    version="2.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://weyes.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Welcome to Web Weyes!"}


# Include routers
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(graph.router, prefix="/api/graph", tags=["graph"])
app.include_router(person.router, prefix="/api/person", tags=["person"])
app.include_router(company.router, prefix="/api/company", tags=["company"])

