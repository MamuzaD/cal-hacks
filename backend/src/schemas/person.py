"""Person entity schemas."""

from pydantic import BaseModel
from datetime import date
from typing import Optional
from uuid import UUID


class PersonResponse(BaseModel):
    """Response for person metadata."""

    id: UUID
    name: str
    role: Optional[str] = None
    img_url: Optional[str] = None
    state: Optional[str] = None
    party_affiliation: Optional[str] = None
    start_date_of_position: Optional[date] = None
