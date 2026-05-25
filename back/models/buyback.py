import enum
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class BuybackStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class BuybackRequest(Base):
    __tablename__ = "buyback_requests"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    buyer_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    buyer_name: Mapped[str] = mapped_column(String)
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"), index=True)
    token_amount: Mapped[int] = mapped_column(Integer)
    status: Mapped[BuybackStatus] = mapped_column(Enum(BuybackStatus), default=BuybackStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
