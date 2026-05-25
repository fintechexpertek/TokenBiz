from datetime import datetime
from pydantic import BaseModel
from models.transaction import TransactionType


class TransactionCreate(BaseModel):
    project_id: str
    amount: int
    price_at_purchase: float
    tx_hash: str
    type: TransactionType


class TransactionOut(BaseModel):
    id: str
    buyer_id: str
    project_id: str
    amount: int
    price_at_purchase: float
    tx_hash: str
    type: TransactionType
    created_at: datetime

    model_config = {"from_attributes": True}
