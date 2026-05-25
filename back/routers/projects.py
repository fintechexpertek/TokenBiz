import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.project import Project
from models.user import User
from schemas.project import ProjectCreate, ProjectOut, TokenSupplyUpdate
from auth import get_current_user, require_role

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project))
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectOut, status_code=201)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("BUSINESS", "INDIVIDUAL")),
):
    project = Project(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        issuer_verified=current_user.verification_status,
        **data.model_dump(),
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.post("/{project_id}/issue", response_model=ProjectOut)
async def issue_tokens(
    project_id: str,
    data: TokenSupplyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("BUSINESS", "INDIVIDUAL", "ADMIN")),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not your project")
    project.total_supply += data.amount
    project.available_supply += data.amount
    await db.commit()
    await db.refresh(project)
    return project


@router.post("/{project_id}/burn", response_model=ProjectOut)
async def burn_tokens(
    project_id: str,
    data: TokenSupplyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("BUSINESS", "INDIVIDUAL", "ADMIN")),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not your project")
    if data.amount > project.available_supply:
        raise HTTPException(status_code=400, detail="Not enough available supply")
    project.total_supply -= data.amount
    project.available_supply -= data.amount
    await db.commit()
    await db.refresh(project)
    return project
