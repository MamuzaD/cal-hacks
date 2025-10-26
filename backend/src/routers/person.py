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
        "role": row["role"],
        "img_url": row.get("img_url"),
        "state": row.get("state"),
        "party_affiliation": row.get("party_affiliation"),
        "start_date_of_position": row.get("start_date_of_position"),
    }
