"""Graph visualization router."""

from fastapi import APIRouter, Depends, HTTPException, Query
from asyncpg import Connection
from src.db.pool import get_db
from src.services.graph_service import get_entity_graph
from src.schemas.graph import GraphResponse, GraphNode, GraphEdge

router = APIRouter()


@router.get("", response_model=GraphResponse)
async def graph(
    id: str = Query(..., description="Entity ID"),
    type: str = Query(..., pattern="^(person|company)$", description="Entity type"),
    db: Connection = Depends(get_db),
):
    """
    Get graph data for visualization centered on an entity.

    Returns nodes and edges in a D3-friendly format.
    """
    nodes_rows, edges_rows = await get_entity_graph(id, type, db)

    if not nodes_rows:
        raise HTTPException(status_code=404, detail="Entity or graph not found")

    # Format nodes
    nodes = []
    for row in nodes_rows:
        if "name" in row:
            node = GraphNode(
                id=str(row["id"]),
                type=row["type"],
                name=row["name"],
                ticker=row.get("ticker"),
                state=row.get("state"),
                party_affiliation=row.get("party_affiliation"),
            )
            nodes.append(node)

    # Format edges
    edges = []
    for e in edges_rows:
        edge = GraphEdge(
            source=str(e["source"]),
            target=str(e["target"]),
            type=e["edge_type"],
            ownership_value=e["ownership_value"],
            label=e.get("edge_type"),
        )
        edges.append(edge)

    # Find center node
    center_node = nodes[0] if nodes else None
    if not center_node:
        raise HTTPException(status_code=404, detail="Center node not found")

    return {
        "center_id": center_node.id,
        "center_type": center_node.type,
        "nodes": nodes,
        "edges": edges,
    }
