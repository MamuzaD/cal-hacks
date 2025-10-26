"""Company service for retrieving company data."""

import logging
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def get_company_by_id(company_id: str, db: Connection):
    """
    Get company metadata by ID.

    Args:
        company_id: Company ID (integer)
        db: Database connection

    Returns:
        Database row or None
    """
    row = await db.fetchrow(
        """
        SELECT id, name, ticker
        FROM companies
        WHERE id = $1
        """,
        int(company_id) if company_id.isdigit() else company_id,
    )
    return row


async def get_company_politicians(company_id: str, db: Connection):
    """
    Get all politicians who have holdings in this company.

    Args:
        company_id: Company ID
        db: Database connection

    Returns:
        List of politician holdings
    """
    rows = await db.fetch(
        """
        SELECT p.id, p.name, p.position, p.state, p.party_affiliation,
               p.estimated_net_worth, p.last_trade_date, h.holding_value
        FROM holdings h
        JOIN politicians p ON h.politician_id = p.id
        WHERE h.company_id = $1
        ORDER BY h.holding_value DESC NULLS LAST
        """,
        int(company_id) if company_id.isdigit() else company_id,
    )
    return rows
