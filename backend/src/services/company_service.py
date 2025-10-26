"""Company service for retrieving company data."""

import logging
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def get_company_by_id(company_name: str, db: Connection):
    """
    Get company metadata by name/ticker.

    Args:
        company_name: Company name or ticker
        db: Database connection

    Returns:
        Database row or None
    """
    row = await db.fetchrow(
        """
        SELECT DISTINCT 
               company as name, 
               ticker,
               NULL as img_url
        FROM holdings
        WHERE company = $1 OR ticker = $1
        LIMIT 1
        """,
        company_name,
    )
    return row


async def get_company_politicians(company_name: str, db: Connection):
    """
    Get all politicians who have holdings in this company.

    Args:
        company_name: Company name
        db: Database connection

    Returns:
        List of politician holdings
    """
    rows = await db.fetch(
        """
        SELECT p.id, p.name, p.position, p.state, p.party_affiliation,
               p.start_date_of_position, h.total_ownership
        FROM holdings h
        JOIN politicians p ON h.politician_id = p.id
        WHERE h.company = $1
        ORDER BY h.total_ownership DESC NULLS LAST
        """,
        company_name,
    )
    return rows
