"""Common schemas."""

from pydantic import BaseModel
from typing import Optional, Literal
from uuid import UUID

EntityType = Literal["person", "company"]


class EntityRef(BaseModel):
    """Reference to an entity (person or company)."""

    id: UUID
    type: EntityType
    name: str
    ticker: Optional[str] = None
