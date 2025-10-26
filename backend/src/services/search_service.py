"""Search service for resolving entities."""

import logging
from typing import Optional
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def resolve_entity_id_by_search(
    q: str, db: Connection, entity_type: str
) -> Optional[dict]:
    """
    Search for an entity by ticker or name and return its id, type, and name.

    Args:
        q: Search query
        db: Database connection
        entity_type: 'person' or 'company' from classification

    Returns:
        dict with 'id', 'type', 'name' or None if not found
    """
    logger.info(f"Attempting database search for: '{q}' as type: '{entity_type}'")
    search_pattern = f"%{q}%"
    
    # Search companies table
    if entity_type == "company":
        # Try exact ticker match
        logger.debug(f"Trying exact ticker match: '{q.upper()}'")
        row = await db.fetchrow(
            "SELECT id, name, ticker FROM companies WHERE ticker = $1 LIMIT 1",
            q.upper(),
        )
        if row:
            logger.info(f"Found company by ticker: {dict(row)}")
            return {
                "id": str(row["id"]),
                "type": "company",
                "name": row["name"],
            }

        # Search for companies by name
        logger.debug(f"Trying company name search with pattern: '{search_pattern}'")
        row = await db.fetchrow(
            "SELECT id, name, ticker FROM companies WHERE name ILIKE $1 LIMIT 1",
            search_pattern,
        )
        if row:
            logger.info(f"Found company: {dict(row)}")
            return {
                "id": str(row["id"]),
                "type": "company",
                "name": row["name"],
            }

    # Search politicians table
    elif entity_type == "person":
        logger.debug(f"Trying politician name search with pattern: '{search_pattern}'")
        row = await db.fetchrow(
            "SELECT id, name FROM politicians WHERE name ILIKE $1 LIMIT 1",
            search_pattern,
        )
        if row:
            logger.info(f"Found person: {dict(row)}")
            return {
                "id": str(row["id"]),
                "type": "person",
                "name": row["name"],
            }

    logger.warning(f"No results found in database for: '{q}' as type '{entity_type}'")
    return None
