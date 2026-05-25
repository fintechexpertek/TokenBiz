from datetime import datetime
from pydantic import BaseModel, EmailStr
from models.user import UserRole, VerificationStatus


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    first_name: str
    last_name: str
    phone: str | None = None
    citizenship: str | None = None
    representative_position: str | None = None
    legal_entity_name: str | None = None
    country_of_incorporation: str | None = None
    project_name: str | None = None
    project_description: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    role: UserRole
    verification_status: VerificationStatus
    first_name: str
    last_name: str
    phone: str | None
    citizenship: str | None
    representative_position: str | None
    legal_entity_name: str | None
    country_of_incorporation: str | None
    project_name: str | None
    project_description: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class VerificationUpdate(BaseModel):
    status: VerificationStatus
