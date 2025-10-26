"""Person service for retrieving politician data."""

import logging
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def get_person_by_id(person_id: str, db: Connection):
    """
    Get person metadata by ID.

    Args:
        person_id: Person UUID
        db: Database connection

    Returns:
        Database row or None
    """
    row = await db.fetchrow(
        """
        SELECT id, name, position as role, NULL as img_url, 
               state, party_affiliation, start_date_of_position
        FROM politicians
        WHERE id = $1
        """,
        int(person_id) if person_id.isdigit() else person_id,
    )
    return row


async def get_person_holdings(person_id: str, db: Connection):
    """
    Get all holdings for a person.

    Args:
        person_id: Person ID
        db: Database connection

    Returns:
        List of holdings
    """
    rows = await db.fetch(
        """
        SELECT company, ticker, total_ownership
        FROM holdings
        WHERE politician_id = $1
        ORDER BY total_ownership DESC NULLS LAST
        """,
        int(person_id) if person_id.isdigit() else person_id,
    )
    return rows
