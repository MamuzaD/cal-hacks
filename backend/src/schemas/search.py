"""Search response schemas."""

from pydantic import BaseModel
from typing import Literal


class SearchResponse(BaseModel):
    """Response from search endpoint."""

    id: str  # UUID as string
    type: Literal["person", "company"]
    confidence: float
    reasoning: str
