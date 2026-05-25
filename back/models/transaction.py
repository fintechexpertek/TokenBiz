import enum
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class TransactionType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    CLAIM = "CLAIM"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    buyer_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), index=True)
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"), index=True)
    amount: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[float] = mapped_column(Float)
    tx_hash: Mapped[str] = mapped_column(String, unique=True)
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
