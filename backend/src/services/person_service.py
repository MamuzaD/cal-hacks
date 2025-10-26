"""Person service for retrieving politician data."""

import logging
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def get_person_by_id(person_id: str, db: Connection):
    """
    Get person metadata by ID.

    Args:
        person_id: Person ID (integer)
        db: Database connection

    Returns:
        Database row or None
    """
    row = await db.fetchrow(
        """
        SELECT id, name, position, state, party_affiliation, 
               estimated_net_worth, last_trade_date
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
        List of holdings with company details
    """
    rows = await db.fetch(
        """
        SELECT h.id, h.politician_id, h.company_id, h.holding_value,
               c.name as company_name, c.ticker
        FROM holdings h
        JOIN companies c ON h.company_id = c.id
        WHERE h.politician_id = $1
        ORDER BY h.holding_value DESC NULLS LAST
        """,
        int(person_id) if person_id.isdigit() else person_id,
    )
    return rows
