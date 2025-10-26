"""Search router."""

import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from asyncpg import Connection
from src.db.pool import get_db
from src.services.classification_service import classify_search_term
from src.services.search_service import resolve_entity_id_by_search
from src.schemas.search import SearchResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=SearchResponse)
async def search(
    q: str = Query(..., description="Search term (person or company)"),
    db: Connection = Depends(get_db),
):
    """
    Search for entities and return canonical ID and type.

    Uses AI to classify the search term, then searches the database
    to return the entity's ID and type.
    """
    logger.info(f"🔍 Search request for: '{q}'")
    
    classification = await classify_search_term(q)
    logger.info(
        f"Classification: {classification['type']} "
        f"(confidence: {classification['confidence']:.2f}, "
        f"reasoning: {classification['reasoning']})"
    )
    
    match = await resolve_entity_id_by_search(q, db, classification['type'])
    
    if not match:
        logger.warning(f"❌ No match found for search term: '{q}'")
        raise HTTPException(status_code=404, detail="Entity not found")

    logger.info(f"✅ Match found: ID={match['id']}, type={match['type']}")
    
    return {
        "id": match["id"],
        "type": match["type"],
        "confidence": classification["confidence"],
        "reasoning": classification["reasoning"],
    }
