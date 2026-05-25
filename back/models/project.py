from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from models.user import VerificationStatus


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    profitability_strategy: Mapped[str] = mapped_column(String)
    token_address: Mapped[str] = mapped_column(String, unique=True)
    token_symbol: Mapped[str] = mapped_column(String)
    total_supply: Mapped[int] = mapped_column(Integer)
    available_supply: Mapped[int] = mapped_column(Integer)
    price_usd: Mapped[float] = mapped_column(Float)
    issuer_name: Mapped[str] = mapped_column(String)
    issuer_verified: Mapped[VerificationStatus] = mapped_column(Enum(VerificationStatus))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
