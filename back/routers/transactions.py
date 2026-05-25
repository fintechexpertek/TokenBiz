import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.transaction import Transaction
from models.project import Project
from models.user import User
from schemas.transaction import TransactionCreate, TransactionOut
from auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/my", response_model=list[TransactionOut])
async def my_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Transaction).where(Transaction.buyer_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/", response_model=TransactionOut, status_code=201)
async def create_transaction(
    data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proj_result = await db.execute(select(Project).where(Project.id == data.project_id))
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if data.type == "BUY" and data.amount > project.available_supply:
        raise HTTPException(status_code=400, detail="Not enough available supply")

    tx = Transaction(
        id=str(uuid.uuid4()),
        buyer_id=current_user.id,
        **data.model_dump(),
    )
    db.add(tx)

    if data.type == "BUY":
        project.available_supply -= data.amount
    elif data.type == "SELL":
        project.available_supply += data.amount

    await db.commit()
    await db.refresh(tx)
    return tx
