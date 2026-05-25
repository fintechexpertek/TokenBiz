import enum
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class ComplaintStatus(str, enum.Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    submitter_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    submitter_name: Mapped[str] = mapped_column(String)
    submitter_email: Mapped[str] = mapped_column(String)
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"), index=True)
    text: Mapped[str] = mapped_column(String)
    status: Mapped[ComplaintStatus] = mapped_column(Enum(ComplaintStatus), default=ComplaintStatus.OPEN)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class AdminNote(Base):
    __tablename__ = "admin_notes"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    admin_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    target_user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    note: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
