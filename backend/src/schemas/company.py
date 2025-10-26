"""Company entity schemas."""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class CompanyResponse(BaseModel):
    """Response for company metadata."""

    id: UUID
    name: str
    ticker: Optional[str] = None
    img_url: Optional[str] = None
