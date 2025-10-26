"""Person/politician router."""

from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection
from src.db.pool import get_db
from src.services.person_service import get_person_by_id
from src.schemas.person import PersonResponse

router = APIRouter()


@router.get("/{id}", response_model=PersonResponse)
async def get_person(
    id: str,
    db: Connection = Depends(get_db),
):
    """
    Get metadata for a specific person/politician.
    """
    row = await get_person_by_id(id, db)

    if not row:
        raise HTTPException(status_code=404, detail="Person not found")

    return {
        "id": row["id"],
        "name": row["name"],
        "position": row["position"],
        "state": row["state"],
        "party_affiliation": row["party_affiliation"],
        "estimated_net_worth": row["estimated_net_worth"],
        "last_trade_date": row.get("last_trade_date"),
    }
