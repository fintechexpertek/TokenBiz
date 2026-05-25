import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.buyback import BuybackRequest
from models.user import User
from schemas.buyback import BuybackCreate, BuybackOut, BuybackStatusUpdate
from auth import get_current_user, require_role

router = APIRouter(prefix="/buybacks", tags=["buybacks"])


@router.get("/", response_model=list[BuybackOut])
async def list_buybacks(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role("ADMIN", "BUSINESS")),
):
    result = await db.execute(select(BuybackRequest))
    return result.scalars().all()


@router.get("/my", response_model=list[BuybackOut])
async def my_buybacks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(BuybackRequest).where(BuybackRequest.buyer_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/", response_model=BuybackOut, status_code=201)
async def create_buyback(
    data: BuybackCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    buyback = BuybackRequest(
        id=str(uuid.uuid4()),
        buyer_id=current_user.id,
        buyer_name=f"{current_user.first_name} {current_user.last_name}",
        **data.model_dump(),
    )
    db.add(buyback)
    await db.commit()
    await db.refresh(buyback)
    return buyback


@router.patch("/{buyback_id}", response_model=BuybackOut)
async def update_buyback_status(
    buyback_id: str,
    data: BuybackStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role("ADMIN", "BUSINESS")),
):
    result = await db.execute(select(BuybackRequest).where(BuybackRequest.id == buyback_id))
    buyback = result.scalar_one_or_none()
    if not buyback:
        raise HTTPException(status_code=404, detail="Buyback not found")
    buyback.status = data.status
    await db.commit()
    await db.refresh(buyback)
    return buyback
