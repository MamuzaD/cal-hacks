"""Person entity schemas."""

from pydantic import BaseModel
from datetime import date
from typing import Optional
from decimal import Decimal


class PersonResponse(BaseModel):
    """Response for person/politician metadata."""

    id: int
    name: str
    position: str
    state: str
    party_affiliation: str
    estimated_net_worth: Decimal
    last_trade_date: Optional[date] = None
