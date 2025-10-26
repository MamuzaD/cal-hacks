"""Search service for resolving entities."""

import logging
from typing import Optional
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def resolve_entity_id_by_search(q: str, db: Connection) -> Optional[dict]:
    """
    Search for an entity by ticker or name and return its id, type, and name.

    Args:
        q: Search query
        db: Database connection

    Returns:
        dict with 'id', 'type', 'name' or None if not found
    """
    # First try exact ticker match
    row = await db.fetchrow(
        "SELECT id, type, name FROM entities WHERE ticker = $1 LIMIT 1",
        q.upper(),
    )
    if row:
        return {
            "id": str(row["id"]),
            "type": row["type"],
            "name": row["name"],
        }

    # Try fuzzy name search (using existing politicians/holdings structure for now)
    # Adapting to existing schema until migration
    search_pattern = f"%{q}%"

    # Search in politicians table
    row = await db.fetchrow(
        """
        SELECT id, name, 'person' as type
        FROM politicians
        WHERE name ILIKE $1
        LIMIT 1
        """,
        search_pattern,
    )
    if row:
        return {
            "id": str(row["id"]),
            "type": "person",
            "name": row["name"],
        }

    # Search in holdings table for companies
    row = await db.fetchrow(
        """
        SELECT DISTINCT company as name, 'company' as type
        FROM holdings
        WHERE company ILIKE $1 OR ticker ILIKE $1
        LIMIT 1
        """,
        search_pattern,
    )
    if row:
        # For now, we'll use a hash or return the first holding for this company
        # In production with new schema, companies would have UUIDs
        import hashlib

        company_id = hashlib.md5(row["name"].encode()).hexdigest()[:8]
        return {
            "id": company_id,  # Temporary until schema migration
            "type": "company",
            "name": row["name"],
        }

    return None
