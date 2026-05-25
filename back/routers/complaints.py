import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.complaint import Complaint, AdminNote
from models.user import User
from schemas.complaint import (
    ComplaintCreate, ComplaintOut, ComplaintStatusUpdate,
    AdminNoteCreate, AdminNoteOut,
)
from auth import get_current_user, require_role

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.get("/", response_model=list[ComplaintOut])
async def list_complaints(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role("ADMIN")),
):
    result = await db.execute(select(Complaint))
    return result.scalars().all()


@router.post("/", response_model=ComplaintOut, status_code=201)
async def create_complaint(
    data: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = Complaint(
        id=str(uuid.uuid4()),
        submitter_id=current_user.id,
        submitter_name=f"{current_user.first_name} {current_user.last_name}",
        submitter_email=current_user.email,
        **data.model_dump(),
    )
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)
    return complaint


@router.patch("/{complaint_id}", response_model=ComplaintOut)
async def update_complaint_status(
    complaint_id: str,
    data: ComplaintStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role("ADMIN")),
):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    complaint.status = data.status
    await db.commit()
    await db.refresh(complaint)
    return complaint


@router.post("/admin-notes", response_model=AdminNoteOut, status_code=201)
async def create_admin_note(
    data: AdminNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    note = AdminNote(
        id=str(uuid.uuid4()),
        admin_id=current_user.id,
        **data.model_dump(),
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note


@router.get("/admin-notes/{user_id}", response_model=list[AdminNoteOut])
async def get_admin_notes(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role("ADMIN")),
):
    result = await db.execute(
        select(AdminNote).where(AdminNote.target_user_id == user_id)
    )
    return result.scalars().all()
