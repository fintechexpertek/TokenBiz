from datetime import datetime
from pydantic import BaseModel
from models.complaint import ComplaintStatus


class ComplaintCreate(BaseModel):
    project_id: str
    text: str


class ComplaintOut(BaseModel):
    id: str
    submitter_id: str
    submitter_name: str
    submitter_email: str
    project_id: str
    text: str
    status: ComplaintStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus


class AdminNoteCreate(BaseModel):
    target_user_id: str
    note: str


class AdminNoteOut(BaseModel):
    id: str
    admin_id: str
    target_user_id: str
    note: str
    created_at: datetime

    model_config = {"from_attributes": True}
