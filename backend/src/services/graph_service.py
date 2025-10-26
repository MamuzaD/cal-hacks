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

    Args:
        entity_id: Entity identifier (integer ID)
        entity_type: 'person' or 'company'
        db: Database connection

    Returns:
        Tuple of (nodes_rows, edges_rows)
    """
    nodes = []
    edges = []

    if entity_type == "person":
        # Get person details
        person = await db.fetchrow(
            """
            SELECT id, name, position, state, party_affiliation,
                   estimated_net_worth, last_trade_date
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
                    "position": person["position"],
                    "state": person["state"],
                    "party_affiliation": person["party_affiliation"],
                    "estimated_net_worth": person["estimated_net_worth"],
                    "last_trade_date": person["last_trade_date"],
                }
            )

            # Get holdings (companies this person owns)
            holdings = await db.fetch(
                """
                SELECT h.id, h.holding_value, c.id as company_id, c.name, c.ticker
                FROM holdings h
                JOIN companies c ON h.company_id = c.id
                WHERE h.politician_id = $1
                """,
                person["id"],
            )

            for holding in holdings:
                # Add company node if not already present
                if not any(n.get("id") == holding["company_id"] for n in nodes):
                    nodes.append(
                        {
                            "id": holding["company_id"],
                            "type": "company",
                            "name": holding["name"],
                            "ticker": holding["ticker"],
                        }
                    )
                # Add edge from person to company
                edges.append(
                    {
                        "source": person["id"],
                        "target": holding["company_id"],
                        "edge_type": "holding",
                        "ownership_value": float(holding["holding_value"])
                        if holding["holding_value"]
                        else None,
                    }
                )

    else:  # company
        # Get company details
        company = await db.fetchrow(
            """
            SELECT id, name, ticker
            FROM companies
            WHERE id = $1
            """,
            int(entity_id) if entity_id.isdigit() else entity_id,
        )
        if company:
            nodes.append(
                {
                    "id": company["id"],
                    "type": "company",
                    "name": company["name"],
                    "ticker": company["ticker"],
                }
            )

            # Get politicians who hold this company
            politicians = await db.fetch(
                """
                SELECT p.id, p.name, p.position, p.state, p.party_affiliation,
                       p.estimated_net_worth, p.last_trade_date, h.holding_value
                FROM holdings h
                JOIN politicians p ON h.politician_id = p.id
                WHERE h.company_id = $1
                """,
                company["id"],
            )

            for pol in politicians:
                if not any(n.get("id") == pol["id"] for n in nodes):
                    nodes.append(
                        {
                            "id": pol["id"],
                            "type": "person",
                            "name": pol["name"],
                            "position": pol["position"],
                            "state": pol["state"],
                            "party_affiliation": pol["party_affiliation"],
                            "estimated_net_worth": pol["estimated_net_worth"],
                            "last_trade_date": pol["last_trade_date"],
                        }
                    )
                # Edge from person to company (person holds company)
                edges.append(
                    {
                        "source": pol["id"],
                        "target": company["id"],
                        "edge_type": "holding",
                        "ownership_value": float(pol["holding_value"])
                        if pol["holding_value"]
                        else None,
                    }
                )

    return nodes, edges
