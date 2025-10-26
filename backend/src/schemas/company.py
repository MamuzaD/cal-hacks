"""Company entity schemas."""

from pydantic import BaseModel


class CompanyResponse(BaseModel):
    """Response for company metadata."""

    id: int
    name: str
    ticker: str
