from datetime import datetime
from pydantic import BaseModel
from models.user import VerificationStatus


class ProjectCreate(BaseModel):
    name: str
    description: str
    profitability_strategy: str
    token_address: str
    token_symbol: str
    total_supply: int
    available_supply: int
    price_usd: float
    issuer_name: str


class ProjectOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    profitability_strategy: str
    token_address: str
    token_symbol: str
    total_supply: int
    available_supply: int
    price_usd: float
    issuer_name: str
    issuer_verified: VerificationStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenSupplyUpdate(BaseModel):
    amount: int
