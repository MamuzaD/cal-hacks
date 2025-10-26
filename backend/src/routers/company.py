"""Company router."""

from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from src.db.pool import get_db
from src.services.company_service import get_company_by_id
from src.schemas.company import CompanyResponse

router = APIRouter()


@router.get("/{id}", response_model=CompanyResponse)
async def get_company(
    id: str,
    db: Connection = Depends(get_db),
):
    """
    Get metadata for a specific company.
    """
    row = await get_company_by_id(id, db)

    if not row:
        raise HTTPException(status_code=404, detail="Company not found")

    return {
        "id": row["id"],
        "name": row["name"],
        "ticker": row["ticker"],
    }
