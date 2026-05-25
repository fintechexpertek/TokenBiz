import enum
from datetime import datetime, timezone
from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class UserRole(str, enum.Enum):
    BUSINESS = "BUSINESS"
    INDIVIDUAL = "INDIVIDUAL"
    BUYER = "BUYER"
    ADMIN = "ADMIN"


class VerificationStatus(str, enum.Enum):
    verified = "verified"
    under_review = "under_review"
    not_verified = "not_verified"
    blocked = "blocked"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus), default=VerificationStatus.not_verified
    )
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    citizenship: Mapped[str | None] = mapped_column(String, nullable=True)
    representative_position: Mapped[str | None] = mapped_column(String, nullable=True)
    legal_entity_name: Mapped[str | None] = mapped_column(String, nullable=True)
    country_of_incorporation: Mapped[str | None] = mapped_column(String, nullable=True)
    project_name: Mapped[str | None] = mapped_column(String, nullable=True)
    project_description: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
