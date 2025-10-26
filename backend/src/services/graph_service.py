"""Graph service for building entity graphs."""

import logging
from typing import Tuple
from asyncpg import Connection

logger = logging.getLogger(__name__)


async def get_entity_graph(
    entity_id: str, entity_type: str, db: Connection
) -> Tuple[list, list]:
    """
    Get graph data for an entity - nodes and edges for visualization.

    This is a simplified version that works with the current schema.
    After migration to entities/edges, this will be more robust.

    Args:
        entity_id: Entity identifier
        entity_type: 'person' or 'company'
        db: Database connection

    Returns:
        Tuple of (nodes_rows, edges_rows)
    """
    # For now, adapting to existing schema
    nodes = []
    edges = []

    if entity_type == "person":
        # Get person details
        person = await db.fetchrow(
            """
            SELECT id, name, position, state, party_affiliation
            FROM politicians
            WHERE id = $1
            """,
            int(entity_id) if entity_id.isdigit() else entity_id,
        )
        if person:
            nodes.append(
                {
                    "id": person["id"],
                    "type": "person",
                    "name": person["name"],
                    "state": person["state"],
                    "party_affiliation": person["party_affiliation"],
                }
            )

            # Get holdings (companies this person owns)
            holdings = await db.fetch(
                """
                SELECT DISTINCT company, ticker, total_ownership
                FROM holdings
                WHERE politician_id = $1
                """,
                person["id"],
            )

            for holding in holdings:
                import hashlib

                company_id = hashlib.md5(holding["company"].encode()).hexdigest()[:8]
                nodes.append(
                    {
                        "id": company_id,
                        "type": "company",
                        "name": holding["company"],
                        "ticker": holding["ticker"],
                    }
                )
                edges.append(
                    {
                        "source": str(person["id"]),
                        "target": company_id,
                        "edge_type": "holding",
                        "ownership_value": float(holding["total_ownership"])
                        if holding["total_ownership"]
                        else None,
                    }
                )

    else:  # company
        # Get company details
        company = await db.fetchrow(
            """
            SELECT DISTINCT company as name, ticker
            FROM holdings
            WHERE company = $1 OR ticker = $1
               OR substring(md5(company), 1, 8) = $1
            LIMIT 1
            """,
            entity_id,
        )
        if company:
            import hashlib

            company_id = hashlib.md5(company["name"].encode()).hexdigest()[:8]
            nodes.append(
                {
                    "id": company_id,
                    "type": "company",
                    "name": company["name"],
                    "ticker": company["ticker"],
                }
            )

            # Get politicians who hold this company
            politicians = await db.fetch(
                """
                SELECT p.id, p.name, p.position, p.state, p.party_affiliation, h.total_ownership
                FROM holdings h
                JOIN politicians p ON h.politician_id = p.id
                WHERE h.company = $1
                """,
                company["name"],
            )

            for pol in politicians:
                if not any(n.get("id") == pol["id"] for n in nodes):
                    nodes.append(
                        {
                            "id": pol["id"],
                            "type": "person",
                            "name": pol["name"],
                            "state": pol["state"],
                            "party_affiliation": pol["party_affiliation"],
                        }
                    )
                edges.append(
                    {
                        "source": company_id,
                        "target": str(pol["id"]),
                        "edge_type": "holding",
                        "ownership_value": float(pol["total_ownership"])
                        if pol["total_ownership"]
                        else None,
                    }
                )

    return nodes, edges
