"""Graph visualization schemas."""

from pydantic import BaseModel
from typing import List, Optional, Literal
from uuid import UUID

EdgeType = Literal[
    "holding",
    "voted_on",
    "lobbied_by",
    "partnered_with",
    "board_member",
    "donated_to",
]


class GraphNode(BaseModel):
    """Node in the graph."""

    id: UUID
    type: Literal["person", "company"]
    name: str
    img_url: Optional[str] = None
    ticker: Optional[str] = None
    state: Optional[str] = None
    party_affiliation: Optional[str] = None


class GraphEdge(BaseModel):
    """Edge connecting two nodes in the graph."""

    source: UUID
    target: UUID
    type: EdgeType
    weight: Optional[float] = None
    ownership_value: Optional[float] = None
    label: Optional[str] = None


class GraphResponse(BaseModel):
    """Complete graph response."""

    center_id: UUID
    center_type: Literal["person", "company"]
    nodes: List[GraphNode]
    edges: List[GraphEdge]
