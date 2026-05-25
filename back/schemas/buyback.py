from datetime import datetime
from pydantic import BaseModel
from models.buyback import BuybackStatus


class BuybackCreate(BaseModel):
    project_id: str
    token_amount: int


class BuybackOut(BaseModel):
    id: str
    buyer_id: str
    buyer_name: str
    project_id: str
    token_amount: int
    status: BuybackStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class BuybackStatusUpdate(BaseModel):
    status: BuybackStatus
