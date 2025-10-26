"""Graph visualization schemas."""

from pydantic import BaseModel
from typing import List, Optional, Literal
from decimal import Decimal
from datetime import date

EdgeType = Literal[
    "stock-holding",
    "lobbying",
    "campaign-contribution",
    "investment",
    "voted_on",
    "partnered_with",
    "board_member",
]

EdgeStatus = Literal[
    "active",      # Currently holding stock
    "sold",        # Previously held, now sold (profit/loss realized)
]


class GraphNode(BaseModel):
    """Node in the graph."""

    id: int
    type: Literal["person", "company"]
    name: str
    # Person fields
    position: Optional[str] = None
    state: Optional[str] = None
    party_affiliation: Optional[str] = None
    estimated_net_worth: Optional[Decimal] = None
    last_trade_date: Optional[date] = None
    # Company fields
    ticker: Optional[str] = None


class GraphEdge(BaseModel):
    """Edge connecting two nodes in the graph."""

    source: int
    target: int
    type: EdgeType
    holding_value: Optional[Decimal] = None
    label: Optional[str] = None
    status: EdgeStatus = "active"  # Status of the relationship/holding


class GraphResponse(BaseModel):
    """Complete graph response."""

    center_id: int
    center_type: Literal["person", "company"]
    nodes: List[GraphNode]
    edges: List[GraphEdge]
